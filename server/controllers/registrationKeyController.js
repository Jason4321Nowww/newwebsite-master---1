const argon2 = require('argon2');
const nodemailer = require('nodemailer');
const RegistrationKey = require('../models/RegistrationKey');
const { registrationKeyEmail } = require('../utils/emailTemplates');

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
  });

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

const sendRegistrationKeyByEmail = async (req, res) => {
  const { email, lang } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  const validLang = ['de', 'fr', 'it', 'en'].includes(lang) ? lang : 'de';
  console.log(`[send-registration-key] lang received: "${lang}" → using: "${validLang}"`);

  try {
    const keyDoc = await RegistrationKey.findOne();
    if (!keyDoc) return res.status(404).json({ message: 'No registration key configured. Set one first.' });

    const tpl = registrationKeyEmail(keyDoc.rawKey, validLang);
    await createTransporter().sendMail({ from: process.env.GMAIL_USER, to: email, ...tpl });

    return res.status(200).json({ message: `Registration key sent to ${email}.` });
  } catch (err) {
    console.error('Error sending registration key email:', err);
    return res.status(500).json({ message: 'Failed to send email. Please try again.' });
  }
};

module.exports = { createOrUpdateKey, getKeyInfo, getKeyForInvite, sendRegistrationKeyByEmail };
