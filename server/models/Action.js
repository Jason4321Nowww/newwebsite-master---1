const mongoose = require('mongoose');

const ActionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  media: [  // 🆕 renamed from `images` to `media`
    {
      type: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Action', ActionSchema);

