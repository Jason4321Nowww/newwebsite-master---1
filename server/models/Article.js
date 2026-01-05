// models/Article.js
const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'image'], required: true },
  value: { type: String }, // for text blocks
  url: { type: String }    // for image blocks (stored path)
}, { _id: false });

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  body: { type: [blockSchema], required: true }, // array of blocks
  author: { type: String, default: 'Redaktion der BKP' }
}, {
  timestamps: true,
  toJSON: { virtuals: true, transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }}
});

module.exports = mongoose.model('Article', articleSchema);
