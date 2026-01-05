/* === models/Product.js === */
const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['clothing', 'merchandise', 'educational', 'activism', 'other'],
    required: true
  },
  stock: { type: Number, default: 0 },
  orderCount: { type: Number, default: 0 },
  mediaUrl: { type: String, default: null },       
// mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  isExternal: { type: Boolean, default: false },
  externalUrl: { type: String, default: null },     // ✅ Optional
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  size: { type: String, enum: ['S', 'M', 'L', 'none'], default: 'none' }
}, { timestamps: true ,
  toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;       // ✅ Add `id` field
        delete ret._id;         // ✅ Remove `_id`
        delete ret.__v;         // ✅ Optional: remove Mongoose internal version field
      }
    }
});

module.exports = mongoose.model('Product', productSchema);
