const mongoose = require('mongoose');

const adminInviteSchema = new mongoose.Schema({
  email:     { type: String, required: true },
  name:      { type: String, default: '' },
  token:     { type: String, required: true, unique: true },
  roleLevel:    { type: Number, required: true },
  userLocation: {
    kantonCode: { type: String, default: '' },
    kantonName: { type: String, default: '' },
    bezirk:     { type: String, default: '' },
    gemeinde:   { type: String, default: '' },
  },
  lang:      { type: String, enum: ['de', 'fr', 'it', 'en'], default: 'de' },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  status:    { type: String, enum: ['pending', 'accepted', 'active', 'expired'], default: 'pending' },
  expiresAt: { type: Date, required: true },
  adminId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model('AdminInvite', adminInviteSchema);
