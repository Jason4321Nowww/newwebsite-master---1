
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username:         { type: String, required: true, trim: true },
    email:            { type: String, default: '' },
    password:         { type: String, required: true, minlength: 6 },
    isActive:         { type: Boolean, default: false },
    emailVerified:    { type: Boolean, default: false },
    emailOtp:         { type: String, default: null },
    emailOtpExpires:  { type: Date,   default: null },
    deleteAt:         { type: Date,   default: null }, // TTL — auto-delete if not verified in 48 h
    userLocation: {
      kantonCode: { type: String, default: '' },
      kantonName: { type: String, default: '' },
      bezirk:     { type: String, default: '' },
      gemeinde:   { type: String, default: '' },
    },
    roleLevel: {
      type: Number,
      // 0=Superadmin, 1=Vorsitzende, 2=Vorstand, 3=Admin,
      // 4=Regionalverwaltung, 5=Lokalverwaltung, 6=Vollmitglied,
      // 7=Regulaermitglied, 8=Oeffentlich
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      default: 8,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;       // ✅ Add `id` field
        delete ret._id;         // ✅ Remove `_id`
        delete ret.__v;         // ✅ Optional: remove Mongoose internal version field
      }
    }
  }
);

// TTL index: MongoDB deletes the document when deleteAt is reached.
// Set deleteAt = null on email verification to cancel deletion.
userSchema.index({ deleteAt: 1 }, { expireAfterSeconds: 0, sparse: true });

module.exports = mongoose.model('User', userSchema);
