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

const {
    createOrUpdateKey,
    getKeyInfo,
    getKeyForInvite,
    sendRegistrationKeyByEmail
} = require('../controllers/registrationKeyController');
const {authMiddleware, adminMiddleware} = require('../middlewares/authMiddleware');
const {registrationKeyLimiter} = require('../middlewares/security');
const {
    sendUserInvite,
    validateUserInviteToken,
    acceptUserInvite,
    getUserInvites,
} = require('../controllers/userInviteController');

// Auth Routes
router.post('/signup', signup);
router.post('/validate-registration-key', registrationKeyLimiter, validateRegistrationKey);  // public — inline key check, rate-limited
router.post('/verify-email-otp', verifyEmailOtp);
router.post('/resend-email-otp', resendEmailOtp);
router.post('/signin', signin);
router.post('/logout', logout);
router.get('/user', authMiddleware, getUser);
router.get('/users', adminMiddleware, getAllUsers);
router.patch('/users/:userId', adminMiddleware, updateUser);
router.delete('/users/:userId', adminMiddleware, deleteUser);

router.post('/users/registration-key', adminMiddleware, createOrUpdateKey);
router.get('/users/registration-key', adminMiddleware, getKeyInfo);
router.post('/users/send-registration-key', adminMiddleware, sendRegistrationKeyByEmail);
router.get('/invite-key', getKeyForInvite);

router.post('/invite-user', adminMiddleware, sendUserInvite);
router.get('/user-invites', adminMiddleware, getUserInvites);
router.get('/user-invite/:token', validateUserInviteToken);
router.post('/user-invite/:token/accept', acceptUserInvite);

module.exports = router;