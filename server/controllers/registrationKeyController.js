const argon2 = require('argon2');
const RegistrationKey = require('../models/RegistrationKey');

const createOrUpdateKey = async (req, res) => {
  const { key } = req.body;

  if (!key || key.length !== 4) {
    return res.status(400).json({ message: 'Key must be exactly 4 characters' });
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



module.exports = { createOrUpdateKey, getKeyInfo };
