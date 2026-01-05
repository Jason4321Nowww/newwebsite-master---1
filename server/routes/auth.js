const express = require('express');
const router = express.Router();
const {
  signup,
  signin,
  logout,
   getUser,
   getAllUsers,
   updateUser,
   deleteUser
 } = require('../controllers/authController');
 
const {createOrUpdateKey, getKeyInfo} = require('../controllers/registrationKeyController');
const { authMiddleware,  adminMiddleware} = require('../middlewares/authMiddleware');
 

// Auth Routes
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', logout);
router.get('/user', authMiddleware ,getUser);
router.get('/users', adminMiddleware, getAllUsers);
router.patch('/users/:userId', adminMiddleware, updateUser);
// Delete user
router.delete('/users/:userId', adminMiddleware, deleteUser); 

// ✅ Registration key route (admin only)
router.post('/users/registration-key', adminMiddleware , createOrUpdateKey);
router.get('/users/registration-key', adminMiddleware, getKeyInfo);

module.exports = router;
