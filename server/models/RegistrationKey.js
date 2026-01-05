const mongoose = require('mongoose');

const registrationKeySchema = new mongoose.Schema({
   rawKey: {
    type: String,
    required: true
  },
  hashedKey: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('RegistrationKey', registrationKeySchema);
