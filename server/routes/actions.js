const express = require('express');
const router = express.Router();
const uploadAction = require('../middlewares/uploadAction');
const {
  createAction,
  getAllActions,
  getActionById,
  updateAction,
  deleteAction
} = require('../controllers/actionController');

router.post('/', uploadAction.array('media', 10), createAction);
router.get('/', getAllActions);
router.get('/:id', getActionById);
router.put('/:id', uploadAction.array('media', 10), updateAction);
router.delete('/:id', deleteAction);

module.exports = router;
