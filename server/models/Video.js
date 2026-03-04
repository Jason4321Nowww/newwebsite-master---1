const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    title_it: { type: String },
    title_fr: { type: String },
    title_en: { type: String },
    videoId: { type: String, required: true },
    orientation: { type: String, enum: ['portrait', 'landscape'], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', videoSchema);
