const express = require('express');
const router = express.Router();

const { getVideos, createVideo, updateVideo, deleteVideo } = require("../controllers/videoController");
router.post('/', createVideo);
router.get('/', getVideos);
router.put('/:id', updateVideo);
router.delete('/:id', deleteVideo);

module.exports = router;
