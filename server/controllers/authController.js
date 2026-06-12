const User = require('../models/User');
const Admin = require('../models/Admin');
const AdminInvite = require('../models/AdminInvite');
const UserInvite = require('../models/UserInvite');
const RegistrationKey = require('../models/RegistrationKey');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const nodemailer = require('nodemailer');

const OTP_EXPIRY_MINUTES = 15;
const { otpEmail, welcomeEmail, accountActivatedEmail } = require('../utils/emailTemplates');

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
  });

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOtpEmail = async (email, otp, lang = 'de') => {
  const tpl = otpEmail(otp, OTP_EXPIRY_MINUTES, lang);
  await createTransporter().sendMail({ from: process.env.GMAIL_USER, to: email, ...tpl });
};

const UNVERIFIED_DELETE_HOURS = 48;

const signup = async (req, res) => {
  const { username, email, password, userLocation, lang, registrationKey } = req.body;
  try {
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    // Validate registration key before doing anything else
    if (!registrationKey) return res.status(400).json({ message: 'Registration key is required.', code: 'INVALID_KEY' });
    const keyDoc = await RegistrationKey.findOne();
    if (!keyDoc) return res.status(500).json({ message: 'Registration key not configured. Contact admin.' });
    const isValidKey = await argon2.verify(keyDoc.hashedKey, registrationKey);
    if (!isValidKey) return res.status(401).json({ message: 'Invalid registration key.', code: 'INVALID_KEY' });

    // Check uniqueness
    if (await User.findOne({ username })) {
      return res.status(400).json({ message: 'Username already exists.' });
    }
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    const otp        = generateOtp();
    const otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    const deleteAt   = new Date(Date.now() + UNVERIFIED_DELETE_HOURS * 60 * 60 * 1000);

    const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });
    const userLang = ['de', 'fr', 'it', 'en'].includes(lang) ? lang : 'de';

    const newUser = await User.create({
      username,
      email:           email.toLowerCase(),
      password:        hashedPassword,
      userLocation: {
        kantonCode: userLocation?.kantonCode || '',
        kantonName: userLocation?.kantonName || '',
        bezirk:     userLocation?.bezirk     || '',
        gemeinde:   userLocation?.gemeinde   || '',
      },
      roleLevel:       8,
      isActive:        false,
      emailVerified:   false,
      emailOtp:        otp,
      emailOtpExpires: otpExpires,
      deleteAt,        // auto-delete if not verified within 48 h
      lang:            userLang,
    });

    await sendOtpEmail(email, otp, userLang);

    res.status(201).json({
      message: 'Account created. Please check your email for the verification code.',
      userId:  newUser._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── POST /api/auth/verify-email-otp ──────────────────────────────────────────
// Validates OTP + registration key. On success: sets emailVerified, clears deleteAt.
const verifyEmailOtp = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified.' });
    }

    if (!user.emailOtp || !user.emailOtpExpires || user.emailOtpExpires < new Date()) {
      return res.status(410).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (user.emailOtp !== String(otp).trim()) {
      return res.status(400).json({ message: 'Incorrect code. Please try again.' });
    }

    // Mark verified and cancel the auto-delete
    user.emailVerified   = true;
    user.emailOtp        = null;
    user.emailOtpExpires = null;
    user.deleteAt        = null;
    await user.save();

    // Send welcome email (fire-and-forget)
    const tpl = welcomeEmail(user.username, user.lang || 'de');
    createTransporter().sendMail({ from: process.env.GMAIL_USER, to: user.email, ...tpl }).catch(() => {});

    res.status(200).json({ message: 'Email verified successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── POST /api/auth/resend-email-otp ──────────────────────────────────────────
const resendEmailOtp = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified.' });
    }

    const otp = generateOtp();
    user.emailOtp        = otp;
    user.emailOtpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    await user.save();

    await sendOtpEmail(user.email, otp, user.lang || 'de');

    res.status(200).json({ message: 'A new verification code has been sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


const signin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ username }, { email: username?.toLowerCase() }]
    });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await argon2.verify(user.password, password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.emailVerified) {
      return res.status(403).json({
        message: 'Please verify your email address before signing in.',
        code: 'EMAIL_NOT_VERIFIED',
        userId: user._id,
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account is not yet activated. Please contact an administrator.' });
    }

    if (user.roleLevel >= 8) {
      return res.status(403).json({ message: 'Your account does not have sufficient membership to sign in. Please contact an administrator.', code: 'ROLE_TOO_LOW' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });
return  res.status(200).json({message: 'Login successful', 
  token, id: user._id,
    roleLevel: user.roleLevel, userLocation: user.userLocation,
    username:username  });


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out' });
};

const getUser = async (req, res) => {
 
   try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.status(200).json({ success: true, message: 'User retrieved successfully', user: user });
    } catch (error) {
      console.error('Error in retrieving user:', error);
      return res.status(500).json({ success: false, message: 'Server Error' });
    }

};
// get all users

// Get all users (admin only) — merges User + Admin records + pending invites.
const getAllUsers = async (req, res) => {
  try {
    const adminRoleLevel = req.admin?.roleLevel ?? 0;

    const visibilityQuery = {
      $or: [
        { isActive: true,  roleLevel: { $gte: adminRoleLevel } },
        { isActive: false, roleLevel: { $gt:  adminRoleLevel } },
      ],
    };
    const inviteVisibility = { status: 'pending', roleLevel: { $gt: adminRoleLevel } };

    const [users, admins, pendingAdminInvites, pendingUserInvites] = await Promise.all([
      adminRoleLevel === 0 ? User.find().select('-password')  : User.find(visibilityQuery).select('-password'),
      adminRoleLevel === 0 ? Admin.find().select('-password') : Admin.find(visibilityQuery).select('-password'),
      AdminInvite.find(inviteVisibility),
      UserInvite.find(inviteVisibility),
    ]);

    const normalizedUsers = users.map(u => {
      const obj = u.toObject({ virtuals: true });
      obj._source  = 'user';
      obj._status  = u.isActive ? 'active' : 'inactive';
      return obj;
    });

    const normalizedAdmins = admins.map(a => ({
      _id:          a._id,
      id:           a._id.toString(),
      username:     a.name,
      email:        a.email,
      roleLevel:    a.roleLevel,
      isActive:     a.isActive,
      userLocation: a.userLocation || null,
      _source:      'admin',
      _status:      a.isActive ? 'active' : 'inactive',
    }));

    const normalizedInvites = [...pendingAdminInvites, ...pendingUserInvites].map(inv => ({
      _id:          inv._id,
      id:           inv._id.toString(),
      username:     null,
      email:        inv.email,
      roleLevel:    inv.roleLevel,
      isActive:     false,
      userLocation: inv.userLocation || null,
      _source:      'invite',
      _status:      'pending',
    }));

    const combined = [...normalizedAdmins, ...normalizedUsers, ...normalizedInvites]
      .sort((x, y) => x.roleLevel - y.roleLevel);

    res.status(200).json(combined);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// delete user (works for User, Admin, AdminInvite, and UserInvite records)
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const adminRoleLevel = req.admin?.roleLevel ?? 0;
  const adminId = req.admin?._id?.toString();

  try {
    let record = await User.findById(userId);
    let isAdminRecord = false;
    let isInviteRecord = false;
    let isAdminInvite = false;

    if (!record) {
      record = await Admin.findById(userId);
      if (record) isAdminRecord = true;
    }
    if (!record) {
      record = await AdminInvite.findById(userId);
      if (record) { isInviteRecord = true; isAdminInvite = true; }
    }
    if (!record) {
      record = await UserInvite.findById(userId);
      if (record) isInviteRecord = true;
    }

    if (!record) return res.status(404).json({ message: 'User not found' });

    if (!isInviteRecord && isAdminRecord && record._id.toString() === adminId) {
      return res.status(403).json({ message: 'You cannot delete your own account.' });
    }

    if (record.roleLevel <= adminRoleLevel) {
      return res.status(403).json({ message: 'You do not have authority to delete this user.' });
    }

    if (isInviteRecord) {
      if (isAdminInvite) {
        await AdminInvite.findByIdAndDelete(userId);
      } else {
        await UserInvite.findByIdAndDelete(userId);
      }
    } else if (isAdminRecord) {
      await Admin.findByIdAndDelete(userId);
      await AdminInvite.deleteMany({ email: record.email });
    } else {
      await User.findByIdAndDelete(userId);
      await UserInvite.deleteMany({ email: record.email });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Universal Update: activate/deactivate or change roleLevel (works for both User and Admin model records)
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;
  const adminRoleLevel = req.admin?.roleLevel ?? 0;
  const adminId = req.admin?._id?.toString();

  const forbidden = ['_id', 'createdAt', 'updatedAt', 'password', 'username'];

  try {
    let record = await User.findById(userId);
    let isAdminRecord = !record;
    if (!record) record = await Admin.findById(userId);
    if (!record) return res.status(404).json({ message: 'User not found' });

    if (isAdminRecord && record._id.toString() === adminId) {
      return res.status(403).json({ message: 'You cannot modify your own account.' });
    }

    if (record.roleLevel <= adminRoleLevel) {
      return res.status(403).json({ message: 'You do not have authority to modify this user.' });
    }

    if (updates.roleLevel !== undefined && updates.roleLevel <= adminRoleLevel) {
      return res.status(403).json({ message: 'You cannot assign a role equal to or above your own.' });
    }

    const wasInactive = !record.isActive;

    for (const key in updates) {
      if (!forbidden.includes(key) && key in record) {
        record.set(key, updates[key]);
      }
    }

    // When admin activates a user, also mark email as verified
    if (!isAdminRecord && wasInactive && record.isActive) {
      record.emailVerified = true;
    }

    await record.save();

    // Send activation email if account was just activated
    if (wasInactive && record.isActive && record.email) {
      const clientUrl  = process.env.CLIENT_URL || 'http://localhost:4200';
      const isAdminRec = isAdminRecord;
      const signinUrl  = isAdminRec ? `${clientUrl}/admin/admin-signin` : `${clientUrl}/signin`;
      const name       = record.username || record.name || record.email;
      const tpl        = accountActivatedEmail(name, signinUrl, record.lang || 'de');
      createTransporter().sendMail({ from: process.env.GMAIL_USER, to: record.email, ...tpl }).catch(() => {});
    }

    res.status(200).json({ message: 'User updated successfully', user: record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update user' });
  }
};



const validateRegistrationKey = async (req, res) => {
  const { registrationKey } = req.body;
  if (!registrationKey) return res.status(200).json({ valid: false });
  try {
    const keyDoc = await RegistrationKey.findOne();
    if (!keyDoc) return res.status(200).json({ valid: false });
    const isValid = await argon2.verify(keyDoc.hashedKey, registrationKey);
    return res.status(200).json({ valid: isValid });
  } catch {
    return res.status(200).json({ valid: false });
  }
};

module.exports = { signup, signin, logout, getUser, getAllUsers, updateUser, deleteUser, verifyEmailOtp, resendEmailOtp, validateRegistrationKey }