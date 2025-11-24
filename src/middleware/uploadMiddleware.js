const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ApiError = require('../utils/apiError');
const { generateFileName } = require('../utils/fileHelper');

const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const prefix = file.mimetype.startsWith('image') ? 'img' : 'vid';
    const filename = generateFileName(file.originalname, prefix);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'];
  const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        'Invalid file type. Only JPEG, PNG, GIF, WEBP images and MP4, MPEG, MOV, WEBM videos are allowed'
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

const uploadSingle = upload.single('file');
const uploadMultiple = upload.array('files', 10);

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadDir,
};
