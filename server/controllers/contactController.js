const Contact = require('../models/Contact');

const submitContact = async (req, res) => {
  try {
    const { name, email, participation } = req.body;
    const contact = new Contact({ name, email, participation });
    await contact.save();
    res.status(201).json({ success: true, message: 'Form submitted successfully.', contact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

const createContact = async (req, res) => {
  try {
    const { name, email, participation } = req.body;
    if (!name?.trim() || !email?.trim() || !participation)
      return res.status(400).json({ success: false, message: 'Name, email and participation are required.' });
    const contact = await new Contact({ name: name.trim(), email: email.trim(), participation }).save();
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const { name, email, participation } = req.body;
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, email, participation },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Contact not found.' });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Contact not found.' });
    res.status(200).json({ success: true, message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

module.exports = { submitContact, getContacts, createContact, updateContact, deleteContact };
