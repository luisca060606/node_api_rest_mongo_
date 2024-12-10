const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/storage/images');
  },
  filename: function (req, file, cb) {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    cb(null, Date.now() + '-' + name);
  },
});

const upload = multer({ storage });

module.exports = upload;
