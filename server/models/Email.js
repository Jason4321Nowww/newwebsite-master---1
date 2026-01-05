const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  name: String,
  email: String,
  lists: [String]   // example: ["Media", "Friends"]
});

module.exports = mongoose.model("Email", EmailSchema);
