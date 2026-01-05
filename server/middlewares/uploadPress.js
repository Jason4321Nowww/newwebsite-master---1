const multer = require('multer');
const path = require('path');
const fs = require('fs');

const pressPath = 'uploads/press';
if (!fs.existsSync(pressPath)) {
  fs.mkdirSync(pressPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, pressPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

module.exports = multer({ storage });
