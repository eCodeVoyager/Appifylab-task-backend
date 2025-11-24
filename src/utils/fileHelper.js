const path = require('path');
const crypto = require('crypto');

const generateFileName = (originalName, prefix = 'file') => {
  const timestamp = Date.now();
  const randomHash = crypto.randomBytes(8).toString('hex');
  const ext = path.extname(originalName).toLowerCase();
  const baseName = path
    .basename(originalName, ext)
    .replace(/[^a-zA-Z0-9]/g, '-')
    .substring(0, 20);

  return `${prefix}-${baseName}-${timestamp}-${randomHash}${ext}`;
};

const getFileType = mimeType => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return 'file';
};

const getFileSizeInMB = bytes => {
  return (bytes / (1024 * 1024)).toFixed(2);
};

module.exports = {
  generateFileName,
  getFileType,
  getFileSizeInMB,
};
