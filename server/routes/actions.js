const express = require('express');
const multer  = require('multer');
const router = express.Router();
const uploadAction = require('../middlewares/uploadAction');
const {
  createAction,
  getAllActions,
  getActionById,
  updateAction,
  deleteAction
} = require('../controllers/actionController');

function handleUpload(req, res, next) {
  uploadAction.array('media', 20)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'One or more files exceed the 10 MB limit.' });
      }
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    }
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}

router.post('/', handleUpload, createAction);
router.get('/', getAllActions);
router.get('/:id', getActionById);
router.put('/:id', handleUpload, updateAction);
router.delete('/:id', deleteAction);

module.exports = router;
