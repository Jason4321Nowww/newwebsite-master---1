const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  kantonCode: { type: String, required: true, index: true },
  kantonName: { type: String, required: true },
  bezirk:     { type: String, required: true, index: true },
  gemeinde:   { type: String, required: true },
}, { timestamps: false });

locationSchema.index({ kantonCode: 1, bezirk: 1 });

module.exports = mongoose.model('Location', locationSchema);
