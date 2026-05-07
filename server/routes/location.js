const express = require('express');
const router = express.Router();
const { getCantons, getBezirke, getGemeinden } = require('../controllers/locationController');

// All public — no auth guard required
router.get('/cantons',                      getCantons);
router.get('/bezirke/:kantonCode',          getBezirke);
router.get('/gemeinden/:kantonCode/:bezirk', getGemeinden);

module.exports = router;
