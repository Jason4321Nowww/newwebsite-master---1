const express = require('express');
const router  = express.Router();
const { adminLogin } = require('../controllers/adminController');
const { adminMiddleware } = require('../middlewares/authMiddleware');
const {
  sendInvite,
  validateInviteToken,
  acceptInvite,
  getPendingAdmins,
  activateAdmin,
  getInvites,
} = require('../controllers/adminInviteController');

// Auth
router.post('/adminSignin', adminLogin);

// Invite flow — public (no auth middleware)
router.get('/invite/:token',         validateInviteToken);
router.post('/invite/:token/accept', acceptInvite);

// Invite management — protected
router.post('/invite',               adminMiddleware, sendInvite);
router.get('/invites',               adminMiddleware, getInvites);
router.get('/pending-admins',        adminMiddleware, getPendingAdmins);
router.patch('/activate/:adminId',   adminMiddleware, activateAdmin);

module.exports = router;
