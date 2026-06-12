const express = require('express');
const router = express.Router();
const {
  signup,
  signin,
  logout,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  verifyEmailOtp,
  resendEmailOtp,
  validateRegistrationKey,
} = require('../controllers/authController');

const {createOrUpdateKey, getKeyInfo, getKeyForInvite, sendRegistrationKeyByEmail} = require('../controllers/registrationKeyController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const {
  sendUserInvite,
  validateUserInviteToken,
  acceptUserInvite,
  getUserInvites,
} = require('../controllers/userInviteController');

// Auth Routes
router.post('/signup', signup);
router.post('/validate-registration-key', validateRegistrationKey);  // public — inline key check
router.post('/verify-email-otp', verifyEmailOtp);   // public — OTP verification
router.post('/resend-email-otp', resendEmailOtp);   // public — resend OTP
router.post('/signin', signin);
router.post('/logout', logout);
router.get('/user', authMiddleware ,getUser);
router.get('/users', adminMiddleware, getAllUsers);
router.patch('/users/:userId', adminMiddleware, updateUser);
// Delete user
router.delete('/users/:userId', adminMiddleware, deleteUser);

// Registration key routes
router.post('/users/registration-key', adminMiddleware, createOrUpdateKey);
router.get('/users/registration-key', adminMiddleware, getKeyInfo);
router.post('/users/send-registration-key', adminMiddleware, sendRegistrationKeyByEmail);
router.get('/invite-key', getKeyForInvite);   // public — gated by valid invite token

// User invite routes
router.post('/invite-user', adminMiddleware, sendUserInvite);
router.get('/user-invites', adminMiddleware, getUserInvites);
router.get('/user-invite/:token', validateUserInviteToken);          // public
router.post('/user-invite/:token/accept', acceptUserInvite);         // public

module.exports = router;
