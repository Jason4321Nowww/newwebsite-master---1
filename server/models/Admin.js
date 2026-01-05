
const mongoose = require('mongoose');

// ✅ Admin Schema
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true   
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  lastLogin: Date,

  // ✅ Add this to make role-based auth work
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin'
  }
}); 

// // ✅ Password hashing
// adminSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

module.exports = mongoose.model('Admin', adminSchema);
