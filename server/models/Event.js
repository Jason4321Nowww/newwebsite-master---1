const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    title_it: { type: String },
    title_fr: { type: String },
    title_en: { type: String },
    image: { type: String }, // optional
    description: { type: String },
    description_it: { type: String },
    description_fr: { type: String },
    description_en: { type: String },
    isMandatory: { type: Boolean, default: false },
    eventDate: { type: Date, required: true },
    date: { type: Date, required: true }, // legacy/backward compatibility

    repeat: {
      type: String,
      enum: ['none', 'weekly', 'biweekly', 'monthly', 'annually'],
      default: 'none',
    },

    repeatEndDate: { type: Date, default: null }, // optional end date for repeating events

    eventType: {
      type: String,
      enum: [
        'oeffentlich',        // public — everyone
        'nationalversammlung', // all logged-in members
        'lokalversammlung',   // roles 4,5,6 + location
        'regionalversammlung',// roles 3,4,5,6 + location
        'rv_zusammenkunft',   // roles 1,2,3 (no location filter)
        'lv_zusammenkunft',   // roles 3,4 + location
        'vorstand',           // roles 0,1,2
        'vorsitzende',        // roles 0,1
        'admin',              // role 0 only
      ],
      default: 'oeffentlich',
    },

    visibilityLevel: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6, 7],
      default: 7,
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
