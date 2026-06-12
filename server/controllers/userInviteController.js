const crypto          = require('crypto');
const argon2          = require('argon2');
const nodemailer      = require('nodemailer');
const UserInvite      = require('../models/UserInvite');
const User            = require('../models/User');
const RegistrationKey = require('../models/RegistrationKey');
const { userInviteEmail } = require('../utils/emailTemplates');

const INVITE_EXPIRY_HOURS = 24;

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

// ── POST /api/auth/invite-user ────────────────────────────────────────────────
// Any admin can invite users, but only to roles strictly below their own.
const sendUserInvite = async (req, res) => {
  try {
    const adminRoleLevel = req.admin.roleLevel ?? 0;
    const { email, roleLevel, userLocation, lang } = req.body;
    const validLang = ['de', 'fr', 'it', 'en'].includes(lang) ? lang : 'de';

    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const rl = Number(roleLevel);
    if (isNaN(rl) || rl <= adminRoleLevel) {
      return res.status(400).json({ error: 'You can only invite someone with a role below your own.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'A user with this email already exists.' });

    // Delete any stale invites for this email (accepted invites whose account was deleted, or expired)
    await UserInvite.deleteMany({ email, status: { $in: ['accepted', 'expired'] } });

    const activeInvite = await UserInvite.findOne({ email, status: 'pending' });
    if (activeInvite) return res.status(400).json({ error: 'An active invite for this email already exists.' });

    const token     = crypto.randomBytes(32).toString('hex');
    const otp       = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const expiresAt = new Date(Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000);

    await UserInvite.create({
      email,
      token,
      otp,
      roleLevel: rl,
      lang: validLang,
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

    const keyDoc    = await RegistrationKey.findOne();
    const regKey    = keyDoc?.rawKey || null;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:4200';
    const inviteUrl = `${clientUrl}/accept-user-invite?token=${token}`;
    const roleName  = ROLE_LABELS[rl] || `Role ${rl}`;
    const tpl       = userInviteEmail(roleName, otp, inviteUrl, INVITE_EXPIRY_HOURS, validLang, regKey);

    await createTransporter().sendMail({ from: process.env.GMAIL_USER, to: email, ...tpl });

    res.status(200).json({ message: 'Invitation sent successfully.' });
  } catch (err) {
    console.error('sendUserInvite error:', err);
    res.status(500).json({ error: 'Failed to send invitation.' });
  }
};

// ── GET /api/auth/user-invite/:token ─────────────────────────────────────────
// Public — validates token, returns invite metadata.
const validateUserInviteToken = async (req, res) => {
  try {
    const invite = await UserInvite.findOne({ token: req.params.token, status: 'pending' });
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
      lang:      invite.lang || 'de',
    });
  } catch (err) {
    console.error('validateUserInviteToken error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// ── POST /api/auth/user-invite/:token/accept ──────────────────────────────────
// Public — user sets username + password, submits OTP. Creates User with isActive: false.

const acceptUserInvite = async (req, res) => {
  try {
    const { username, password, otp, registrationKey } = req.body;

    if (!username || !password || !otp || !registrationKey) {
      return res.status(400).json({ error: 'Username, password, OTP, and registration key are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    // Validate registration key
    const keyDoc = await RegistrationKey.findOne();
    if (!keyDoc) return res.status(500).json({ error: 'Registration key not configured. Contact admin.' });
    const isValidKey = await argon2.verify(keyDoc.hashedKey, registrationKey);
    if (!isValidKey) return res.status(401).json({ error: 'Invalid registration key.' });

    const invite = await UserInvite.findOne({ token: req.params.token, status: 'pending' });
    if (!invite) return res.status(404).json({ error: 'Invalid or already-used invitation.' });

    if (invite.expiresAt < new Date()) {
      invite.status = 'expired';
      await invite.save();
      return res.status(410).json({ error: 'This invitation has expired.' });
    }

    if (invite.otp !== otp.trim()) {
      return res.status(400).json({ error: 'Incorrect OTP. Please check your email.' });
    }

    // Check for duplicate email or username
    const byEmail = await User.findOne({ email: invite.email });
    if (byEmail) return res.status(400).json({ error: 'An account with this email already exists.' });

    const byUsername = await User.findOne({ username: username.trim() });
    if (byUsername) return res.status(400).json({ error: 'Username is already taken.' });

    const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });

    await User.create({
      username:      username.trim(),
      email:         invite.email,
      password:      hashedPassword,
      roleLevel:     invite.roleLevel,
      userLocation:  invite.userLocation || {},
      lang:          invite.lang || 'de',
      isActive:      false,
      emailVerified: true,  // OTP was verified above — email ownership is proven
    });

    invite.status = 'accepted';
    await invite.save();

    res.status(201).json({ message: 'Account created. An administrator will activate your account shortly.' });
  } catch (err) {
    console.error('acceptUserInvite error:', err);
    res.status(500).json({ error: 'Failed to create account.' });
  }
};

// ── GET /api/auth/user-invites ────────────────────────────────────────────────
// Admin only — list sent user invites.
const getUserInvites = async (req, res) => {
  try {
    const invites = await UserInvite.find({ status: { $in: ['pending', 'accepted'] } })
      .populate('invitedBy', 'name email')
      .sort({ createdAt: -1 });

    // Remove accepted invites where the user account was later deleted
    const emails = invites.filter(i => i.status === 'accepted').map(i => i.email);
    const existingEmails = emails.length
      ? new Set((await User.find({ email: { $in: emails } }).select('email')).map(u => u.email))
      : new Set();

    const filtered = invites.filter(i => i.status === 'pending' || existingEmails.has(i.email));
    res.status(200).json(filtered);
  } catch (err) {
    console.error('getUserInvites error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { sendUserInvite, validateUserInviteToken, acceptUserInvite, getUserInvites };
