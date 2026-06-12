const mongoose = require('mongoose');

const userInviteSchema = new mongoose.Schema({
  email:        { type: String, required: true },
  token:        { type: String, required: true, unique: true },
  otp:          { type: String, required: true },
  roleLevel:    { type: Number, default: 8 },
  userLocation: {
    kantonCode: { type: String, default: '' },
    kantonName: { type: String, default: '' },
    bezirk:     { type: String, default: '' },
    gemeinde:   { type: String, default: '' },
  },
  lang:         { type: String, enum: ['de', 'fr', 'it', 'en'], default: 'de' },
  invitedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  status:       { type: String, enum: ['pending', 'accepted', 'expired'], default: 'pending' },
  expiresAt:    { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('UserInvite', userInviteSchema);
