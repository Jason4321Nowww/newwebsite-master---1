const mongoose = require('mongoose');

const ActionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  title_it: { type: String },
  title_fr: { type: String },
  title_en: { type: String },
  description: {
    type: String,
    required: true,
  },
  description_it: { type: String },
  description_fr: { type: String },
  description_en: { type: String },
  media: [  // 🆕 renamed from `images` to `media`
    {
      type: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Action', ActionSchema);

