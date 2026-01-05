const express = require('express');
const router = express.Router();

const {  getVideos,  createVideo, deleteVideo } = require("../controllers/videoController");
router.post('/', createVideo);
router.get('/', getVideos);
router.delete('/:id', deleteVideo);

module.exports = router;
