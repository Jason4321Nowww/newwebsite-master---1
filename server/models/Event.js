const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String }, // optional
    description: { type: String },
    isMandatory: { type: Boolean, default: false },
    eventDate: { type: Date, required: true },
    date: { type: Date, required: true }, // legacy/backward compatibility

    repeat: {
      type: String,
      enum: ['none', 'weekly', 'bi-weekly', 'monthly', 'annually'],
      default: 'none',
    },

    visibilityLevel: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6, 7],
      required: true,
      default: 0,
    },
  eventLocation: { type: String, default: '' }, 

    attendees: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        isAnonymous: { type: Boolean, default: false },
      },
    ],

    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

module.exports = mongoose.model('Event', eventSchema);
