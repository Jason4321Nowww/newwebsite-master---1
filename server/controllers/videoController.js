const probe = require('probe-image-size');
const Video = require('../models/Video');


const createVideo = async (req, res) => {
  const { title, title_it, title_fr, title_en, videoId, orientation } = req.body;

  if (!title || !videoId) {
    return res.status(400).json({ message: 'Title and videoId are required' });
  }

  try {
    const newVideo = await Video.create({ title, title_it, title_fr, title_en, videoId, orientation });
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create video', error });
  }
};
const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ _id: -1 });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, title_it, title_fr, title_en, videoId, orientation } = req.body;
    const updated = await Video.findByIdAndUpdate(
      id,
      { title, title_it, title_fr, title_en, videoId, orientation },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Video not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update video', error });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Video.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Video not found' });
    res.status(200).json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete video', error });
  }
};

module.exports = {
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo,
};