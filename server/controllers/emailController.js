const Email = require("../models/Email");
const MailingList = require("../models/MailingList");

// ─── Email CRUD ──────────────────────────────────────────────────────────────

const createEmail = async (req, res) => {
  const { name, email } = req.body;
  const saved = await new Email({ name, email, lists: [] }).save();
  res.json(saved);
};

const updateEmail = async (req, res) => {
  const { name, email } = req.body;
  const updated = await Email.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
  res.json(updated);
};

const deleteEmail = async (req, res) => {
  await Email.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

const getAllEmails = async (req, res) => {
  const data = await Email.find();
  res.json(data);
};

const getEmail = async (req, res) => {
  const email = await Email.findById(req.params.id);
  res.json(email);
};

// ─── List membership ─────────────────────────────────────────────────────────

const addToList = async (req, res) => {
  const { emailId } = req.params;
  const { listName } = req.body;
  await Email.findByIdAndUpdate(emailId, { $addToSet: { lists: listName } });
  res.json({ message: "Added to list" });
};

const removeFromList = async (req, res) => {
  const { emailId } = req.params;
  const { listName } = req.body;
  await Email.findByIdAndUpdate(emailId, { $pull: { lists: listName } });
  res.json({ message: "Removed from list" });
};

// ─── Mailing list CRUD ────────────────────────────────────────────────────────

const getListNames = async (_req, res) => {
  const docs = await MailingList.find({}, 'name').sort({ name: 1 }).lean();
  res.json(docs.map(d => d.name));
};

const createList = async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: "List name required" });
  try {
    const list = await new MailingList({ name: name.trim() }).save();
    res.json(list);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: "List name already exists" });
    res.status(500).json({ error: e.message });
  }
};

const deleteList = async (req, res) => {
  const name = decodeURIComponent(req.params.name);
  await MailingList.findOneAndDelete({ name });
  await Email.updateMany({ lists: name }, { $pull: { lists: name } });
  res.json({ message: "Deleted" });
};

const renameList = async (req, res) => {
  const oldName = decodeURIComponent(req.params.name);
  const { name: newName } = req.body;
  if (!newName?.trim()) return res.status(400).json({ error: "New name required" });
  try {
    await MailingList.findOneAndUpdate({ name: oldName }, { name: newName.trim() });
    await Email.updateMany({ lists: oldName }, { $set: { "lists.$[el]": newName.trim() } }, {
      arrayFilters: [{ "el": oldName }]
    });
    res.json({ message: "Renamed" });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: "Name already exists" });
    res.status(500).json({ error: e.message });
  }
};

const getEmailsByList = async (req, res) => {
  const listName = decodeURIComponent(req.params.listName);
  const emails = await Email.find({ lists: listName });
  res.json(emails);
};

module.exports = {
  createEmail, updateEmail, deleteEmail, getAllEmails, getEmail,
  addToList, removeFromList,
  getListNames, createList, deleteList, renameList, getEmailsByList
};
