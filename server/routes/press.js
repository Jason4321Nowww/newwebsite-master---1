const express = require('express');
const { getRelease, getReleaseById, deleteRelease, postRelease, sendReleaseEmail} = require('../controllers/pressController');
const router = express.Router();
const uploadPress = require('../middlewares/uploadPress');

router.get('/', getRelease);
router.get('/:id', getReleaseById);
router.post('/', uploadPress.single('image'), postRelease);
router.post('/send/:id', sendReleaseEmail); // ✅ New route
router.delete('/:id', deleteRelease);



module.exports = router;
