const express = require('express');
const router = express.Router();
const { adminRegister,  adminLogin,  protectedRoute,  authenticateToken} = require('../controllers/adminController');


router.post('/adminRegister', adminRegister);
router.post('/adminSignin', adminLogin);


module.exports = router;