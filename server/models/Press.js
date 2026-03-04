const mongoose = require('mongoose');

const PressReleaseSchema = new mongoose.Schema({
  title: String,
  title_it: String,
  title_fr: String,
  title_en: String,
  content: String,
  content_it: String,
  content_fr: String,
  content_en: String,
  image: String,
  date: { type: Date, default: Date.now },
});
module.exports =  mongoose.model('PressRelease', PressReleaseSchema);
