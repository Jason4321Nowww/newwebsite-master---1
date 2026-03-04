
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    isActive: { type: Boolean, default: false }, // ✅ User active status
    // isAdmin: { type: Boolean, default: false },
    userLocation: { type: String, default: '' },    
    roleLevel: {
      type: Number,
      // 0=Admin, 1=Vorsitzende, 2=Vorstand, 3=Regionalverwaltung,
      // 4=Lokalverwaltung, 5=Vollmitglied, 6=Regulaermitglied, 7=Oeffentlich
      enum: [0, 1, 2, 3, 4, 5, 6, 7],
      default: 7, // New users start as Oeffentlich — admin must promote
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

module.exports = mongoose.model('User', userSchema);
