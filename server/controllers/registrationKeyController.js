const argon2 = require('argon2');
const RegistrationKey = require('../models/RegistrationKey');

const createOrUpdateKey = async (req, res) => {
  // Only Superadmin (roleLevel 0) may create or update the registration key
  if ((req.admin?.roleLevel ?? 99) !== 0) {
    return res.status(403).json({ message: 'Only the Superadmin can set the registration key.' });
  }

  const { key: rawInput } = req.body;
  const key = rawInput?.trim();

  const ALLOWED = /^[A-Za-z0-9!@#$%^&+=\-_.,;:|~?]+$/;
  const HAS_LETTER = /[A-Za-z]/;
  const HAS_DIGIT = /[0-9]/;
  const HAS_SYMBOL = /[!@#$%^&+=\-_.,;:|~?]/;

  if (!key || key.length !== 20) {
    return res.status(400).json({ message: 'Key must be exactly 20 characters.' });
  }
  if (!ALLOWED.test(key)) {
    return res.status(400).json({ message: 'Key contains invalid characters.' });
  }
  if (!HAS_LETTER.test(key)) {
    return res.status(400).json({ message: 'Key must contain at least one letter.' });
  }
  if (!HAS_DIGIT.test(key)) {
    return res.status(400).json({ message: 'Key must contain at least one number.' });
  }
  if (!HAS_SYMBOL.test(key)) {
    return res.status(400).json({ message: 'Key must contain at least one special character (! @ # $ % ^ & + = - _ . , ; : | ~ ?).' });
  }

  try {
    const hashed = await argon2.hash(key);
    let doc = await RegistrationKey.findOne();

    if (!doc) {
      await RegistrationKey.create({ rawKey: key, hashedKey: hashed });
    } else {
      doc.rawKey = key;
      doc.hashedKey = hashed;
      await doc.save();
    }

    res.status(200).json({ message: 'Registration key saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while saving key' });
  }
};


const getKeyInfo = async (req, res) => {
  try {
    const keyDoc = await RegistrationKey.findOne();
    if (!keyDoc) {
      return res.status(404).json({ message: 'No registration key found' });
    }

    return res.status(200).json({
      message: 'Key fetched successfully',
      key: keyDoc.rawKey  // Only show to Admins
    });
  } catch (err) {
    console.error('Error fetching registration key:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};



// Returns the plain key when caller holds a valid (pending) invite token — never exposed in UI
const AdminInvite = require('../models/AdminInvite');
const UserInvite  = require('../models/UserInvite');

const getKeyForInvite = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: 'Token required.' });

  try {
    const adminInvite = await AdminInvite.findOne({ token, status: 'pending' });
    const userInvite  = !adminInvite && await UserInvite.findOne({ token, status: 'pending' });

    if (!adminInvite && !userInvite) {
      return res.status(403).json({ message: 'Invalid or expired invite token.' });
    }

    const keyDoc = await RegistrationKey.findOne();
    if (!keyDoc) return res.status(500).json({ message: 'Registration key not configured.' });

    return res.status(200).json({ key: keyDoc.rawKey });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
};

// Returns the plain key for the signup flow — gated by a valid pending userId
const getKeyForSignup = async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: 'userId required.' });

  try {
    const User = require('../models/User');
    const user = await User.findById(userId);
    if (!user || user.emailVerified) {
      return res.status(403).json({ message: 'Invalid request.' });
    }
    const keyDoc = await RegistrationKey.findOne();
    if (!keyDoc) return res.status(500).json({ message: 'Registration key not configured.' });
    return res.status(200).json({ key: keyDoc.rawKey });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { createOrUpdateKey, getKeyInfo, getKeyForInvite, getKeyForSignup };
