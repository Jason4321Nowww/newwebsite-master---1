const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    statement: {
      type: String,
      required: true,
      trim: true,
    }, link: {
      type: String,
      trim:true,
    },
    isActive: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model('Banner', bannerSchema);
