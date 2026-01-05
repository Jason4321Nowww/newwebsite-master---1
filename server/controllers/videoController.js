const probe = require('probe-image-size');
const Video = require('../models/Video');


const createVideo = async (req, res) => {
  const { title, videoId, orientation } = req.body;

  if (!title || !videoId) {
    return res.status(400).json({ message: 'Title and videoId are required' });
  }

  try {
    const newVideo = await Video.create({ title, videoId, orientation }); // ← MongoDB create method
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create video', error });
  }
};
const getVideos = async (req, res) => {
  try {
    const videos = await Video.find(); // ← MongoDB find method
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
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
  deleteVideo,
};