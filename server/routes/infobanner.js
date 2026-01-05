const express = require('express');
const router = express.Router();
const {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
} = require('../controllers/infobannerController');

router.post('/', createBanner);
router.get('/', getBanners);
router.put('/:id', updateBanner);
router.delete('/:id', deleteBanner);

module.exports = router;
