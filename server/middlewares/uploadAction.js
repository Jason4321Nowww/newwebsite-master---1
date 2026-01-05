// middlewares/uploadAction.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const actionPath = 'uploads/actions';
if (!fs.existsSync(actionPath)) {
  fs.mkdirSync(actionPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, actionPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});



const fileFilter = (req, file, cb) => {
  console.log('Received file mimetype:', file.mimetype);

  const isImageOrVideo =
    file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');

  if (isImageOrVideo) {
    cb(null, true);
  } else {
    console.log('❌ Rejected file:', file.originalname, 'with type:', file.mimetype);
    cb(new Error('Only images and videos are allowed'), false);
  }
};



module.exports = multer({
  storage,
  fileFilter
});
