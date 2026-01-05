const Email = require("../models/Email");

// ➤ Create single email
const createEmail = async (req, res) => {
  const { name, email } = req.body;
  const saved = await new Email({ name, email, lists: [] }).save();
  res.json(saved);
};

// ➤ Update email
const updateEmail = async (req, res) => {
  const { name, email } = req.body;
  const updated = await Email.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
  res.json(updated);
};

// ➤ Delete email
const deleteEmail = async (req, res) => {
  await Email.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

// ➤ Get all emails
const getAllEmails = async (req, res) => {
  const data = await Email.find();
  res.json(data);
};

// ➤ Get single email
const getEmail = async (req, res) => {
  const email = await Email.findById(req.params.id);
  res.json(email);
};

// ➤ Add email to list
const addToList = async (req, res) => {
  const { emailId } = req.params;
  const { listName } = req.body;
  await Email.findByIdAndUpdate(emailId, { $addToSet: { lists: listName } });
  res.json({ message: "Added to list" });
};

// ➤ Remove email from list
const removeFromList = async (req, res) => {
  const { emailId } = req.params;
  const { listName } = req.body;
  await Email.findByIdAndUpdate(emailId, { $pull: { lists: listName } });
  res.json({ message: "Removed from list" });
};

// ➤ Fetch all unique list names
const getListNames = async (_req, res) => {
  const emails = await Email.find();
  const allLists = [...new Set(emails.flatMap(e => e.lists))];
  res.json(allLists);
};

// ➤ Get emails inside a list
const getEmailsByList = async (req, res) => {
  const { listName } = req.params;
  const emails = await Email.find({ lists: listName });
  res.json(emails);
};

module.exports = {
  createEmail,
  updateEmail,
  deleteEmail,
  getAllEmails,
  getEmail,
  addToList,
  removeFromList,
  getListNames,
  getEmailsByList
};
