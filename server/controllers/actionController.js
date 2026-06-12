const Action = require('../models/Action');

// Create Action
const createAction = async (req, res) => {
  try {
    const mediaPaths = req.files?.map(file => `/uploads/actions/${file.filename}`) || [];
    const { title, title_it, title_fr, title_en, description, description_it, description_fr, description_en } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }
    if (!mediaPaths.length) {
      return res.status(400).json({ message: 'At least one media file is required.' });
    }

    const newAction = new Action({ title, title_it, title_fr, title_en, description, description_it, description_fr, description_en, media: mediaPaths });
    const saved = await newAction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All
const getAllActions = async (req, res) => {
  try {
    const actions = await Action.find().sort({ createdAt: -1 });
    res.json(actions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get One
const getActionById = async (req, res) => {
  try {
    const action = await Action.findById(req.params.id);
    if (!action) return res.status(404).json({ message: 'Not found' });
    res.json(action);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
const updateAction = async (req, res) => {
  try {
    const mediaPaths = req.files?.map(file => `/uploads/actions/${file.filename}`) || [];
    const { title, title_it, title_fr, title_en, description, description_it, description_fr, description_en } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const updateData = { title, title_it, title_fr, title_en, description, description_it, description_fr, description_en };

    if (mediaPaths.length) {
      updateData.$push = { media: { $each: mediaPaths } };
    }
   

   const updated = await Action.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
const deleteAction = async (req, res) => {
  try {
    const action = await Action.findByIdAndDelete(req.params.id);
    if (!action) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createAction,
  getAllActions,
  getActionById,
  updateAction,
  deleteAction
}
