const express = require('express');
const router = express.Router();
const { submitContact, getContacts, createContact, updateContact, deleteContact } = require('../controllers/contactController');
const { contactLimiter } = require('../middlewares/security');

router.post('/', contactLimiter, submitContact);
router.get('/admin', getContacts);
router.post('/admin', createContact);
router.put('/admin/:id', updateContact);
router.delete('/admin/:id', deleteContact);

module.exports = router;