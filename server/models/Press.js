const mongoose = require('mongoose');

const PressReleaseSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  date: { type: Date, default: Date.now },
});
module.exports =  mongoose.model('PressRelease', PressReleaseSchema);
