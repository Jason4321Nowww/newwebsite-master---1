const crypto          = require('crypto');
const argon2          = require('argon2');
const nodemailer      = require('nodemailer');
const AdminInvite     = require('../models/AdminInvite');
const Admin           = require('../models/Admin');
const RegistrationKey = require('../models/RegistrationKey');
const { adminInviteEmail, accountActivatedEmail } = require('../utils/emailTemplates');

const INVITE_EXPIRY_HOURS = 48;

const ROLE_LABELS = [
  'Superadmin',         // 0
  'Vorsitzende',        // 1
  'Vorstand',           // 2
  'Admin',              // 3
  'Regionalverwaltung', // 4
  'Lokalverwaltung',    // 5
  'Vollmitglied',       // 6
  'Regulaermitglied',   // 7
  'Oeffentlich',        // 8
];

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
  });

// ── POST /api/admin/invite ────────────────────────────────────────────────────
// Only roleLevel <= 2 (Superadmin / Vorsitzende / Vorstand) may send invites.
const sendInvite = async (req, res) => {
  try {
    const adminRoleLevel = req.admin.roleLevel ?? 0;
    if (adminRoleLevel > 2) {
      return res.status(403).json({ error: 'Only Superadmin, Vorsitzende or Vorstand can send invites.' });
    }

    const { email, roleLevel, userLocation } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });
    if (roleLevel === undefined || Number(roleLevel) <= adminRoleLevel) {
      return res.status(400).json({ error: 'You can only invite someone with a role below your own.' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ error: 'An admin with this email already exists.' });

    // Delete any stale invites for this email (accepted invites whose account was deleted, or expired)
    await AdminInvite.deleteMany({ email, status: { $in: ['accepted', 'expired'] } });

    const activeInvite = await AdminInvite.findOne({ email, status: 'pending' });
    if (activeInvite) return res.status(400).json({ error: 'An active invite for this email already exists.' });

    const token     = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000);

    await AdminInvite.create({
      email,
      token,
      roleLevel: Number(roleLevel),
      userLocation: {
        kantonCode: userLocation?.kantonCode || '',
        kantonName: userLocation?.kantonName || '',
        bezirk:     userLocation?.bezirk     || '',
        gemeinde:   userLocation?.gemeinde   || '',
      },
      invitedBy: req.admin._id,
      status: 'pending',
      expiresAt,
    });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:4200';
    const inviteUrl = `${clientUrl}/admin/accept-invite?token=${token}`;
    const roleName  = ROLE_LABELS[Number(roleLevel)] || `Role ${roleLevel}`;
    const tpl       = adminInviteEmail(roleName, inviteUrl, INVITE_EXPIRY_HOURS);

    await createTransporter().sendMail({ from: process.env.GMAIL_USER, to: email, ...tpl });

    res.status(200).json({ message: 'Invitation sent successfully.' });
  } catch (err) {
    console.error('sendInvite error:', err);
    res.status(500).json({ error: 'Failed to send invitation.' });
  }
};

// ── GET /api/admin/invite/:token ──────────────────────────────────────────────
// Public — validates token, returns invite metadata so the accept-page can show info.
const validateInviteToken = async (req, res) => {
  try {
    const invite = await AdminInvite.findOne({ token: req.params.token, status: 'pending' });
    if (!invite) return res.status(404).json({ error: 'Invalid or already-used invitation.' });

    if (invite.expiresAt < new Date()) {
      invite.status = 'expired';
      await invite.save();
      return res.status(410).json({ error: 'This invitation has expired.' });
    }

    res.status(200).json({
      email:     invite.email,
      roleLevel: invite.roleLevel,
      roleName:  ROLE_LABELS[invite.roleLevel] || `Role ${invite.roleLevel}`,
    });
  } catch (err) {
    console.error('validateInviteToken error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// ── POST /api/admin/invite/:token/accept ──────────────────────────────────────
// Public — invited person sets their name + password. Creates Admin with isActive: false.
const acceptInvite = async (req, res) => {
  try {
    const { name, password, registrationKey } = req.body;
    if (!name || !password || !registrationKey)
      return res.status(400).json({ error: 'Name, password, and registration key are required.' });
    if (password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });

    // Validate registration key
    const keyDoc = await RegistrationKey.findOne();
    if (!keyDoc) return res.status(500).json({ error: 'Registration key not configured. Contact admin.' });
    const isValidKey = await argon2.verify(keyDoc.hashedKey, registrationKey);
    if (!isValidKey) return res.status(401).json({ error: 'Invalid registration key.' });

    const invite = await AdminInvite.findOne({ token: req.params.token, status: 'pending' });
    if (!invite) return res.status(404).json({ error: 'Invalid or already-used invitation.' });

    if (invite.expiresAt < new Date()) {
      invite.status = 'expired';
      await invite.save();
      return res.status(410).json({ error: 'This invitation has expired.' });
    }

    const existing = await Admin.findOne({ email: invite.email });
    if (existing) return res.status(400).json({ error: 'An account with this email already exists.' });

    const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });
    const admin = await Admin.create({
      name,
      email:        invite.email,
      password:     hashedPassword,
      roleLevel:    invite.roleLevel,
      userLocation: invite.userLocation || {},
      isActive:     false,
    });

    invite.status  = 'accepted';
    invite.adminId = admin._id;
    invite.name    = name;
    await invite.save();

    res.status(201).json({ message: 'Account created. A higher authority will activate your account shortly.' });
  } catch (err) {
    console.error('acceptInvite error:', err);
    res.status(500).json({ error: 'Failed to create account.' });
  }
};

// ── GET /api/admin/pending-admins ─────────────────────────────────────────────
// Admins with roleLevel <= 2 see inactive admins they have authority to activate.
const getPendingAdmins = async (req, res) => {
  try {
    const adminRoleLevel = req.admin.roleLevel ?? 0;
    if (adminRoleLevel > 2) return res.status(403).json({ error: 'Not authorized.' });

    const pending = await Admin.find({
      isActive:  false,
      roleLevel: { $gt: adminRoleLevel },
    }).select('-password');

    res.status(200).json(pending);
  } catch (err) {
    console.error('getPendingAdmins error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// ── PATCH /api/admin/activate/:adminId ────────────────────────────────────────
const activateAdmin = async (req, res) => {
  try {
    const adminRoleLevel = req.admin.roleLevel ?? 0;
    if (adminRoleLevel > 2) return res.status(403).json({ error: 'Not authorized.' });

    const target = await Admin.findById(req.params.adminId);
    if (!target) return res.status(404).json({ error: 'Admin not found.' });
    if (target.roleLevel <= adminRoleLevel) {
      return res.status(403).json({ error: 'You cannot activate this admin.' });
    }

    target.isActive = true;
    await target.save();

    // Notify the admin their account is now active
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:4200';
    const tpl = accountActivatedEmail(target.name, `${clientUrl}/admin/admin-signin`);
    createTransporter().sendMail({ from: process.env.GMAIL_USER, to: target.email, ...tpl }).catch(() => {});

    res.status(200).json({ message: 'Admin activated successfully.' });
  } catch (err) {
    console.error('activateAdmin error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// ── GET /api/admin/invites ────────────────────────────────────────────────────
const getInvites = async (req, res) => {
  try {
    const adminRoleLevel = req.admin.roleLevel ?? 0;
    if (adminRoleLevel > 2) return res.status(403).json({ error: 'Not authorized.' });

    const invites = await AdminInvite.find({ status: { $in: ['pending', 'accepted'] } })
      .populate('invitedBy', 'name email')
      .sort({ createdAt: -1 });

    // Remove accepted invites where the admin account was later deleted
    const emails = invites.filter(i => i.status === 'accepted').map(i => i.email);
    const existingEmails = emails.length
      ? new Set((await Admin.find({ email: { $in: emails } }).select('email')).map(a => a.email))
      : new Set();

    const filtered = invites.filter(i => i.status === 'pending' || existingEmails.has(i.email));
    res.status(200).json(filtered);
  } catch (err) {
    console.error('getInvites error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { sendInvite, validateInviteToken, acceptInvite, getPendingAdmins, activateAdmin, getInvites };
