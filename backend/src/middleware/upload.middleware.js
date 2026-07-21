const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const fs = require('fs');

const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
  process.env.CLOUDINARY_API_SECRET && 
  process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Local storage configuration
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const localStorage = {
  _handleFile: (req, file, cb) => {
    diskStorage._handleFile(req, file, (err, info) => {
      if (err) return cb(err);
      
      const host = req.get('host') || 'localhost:5000';
      const protocol = req.protocol || 'http';
      
      cb(null, {
        destination: info.destination,
        filename: info.filename,
        path: `${protocol}://${host}/uploads/${info.filename}`,
        size: info.size
      });
    });
  },
  _removeFile: (req, file, cb) => {
    diskStorage._removeFile(req, file, cb);
  }
};

const createStorage = (folder) => {
  if (isCloudinaryConfigured) {
    return new CloudinaryStorage({
      cloudinary,
      params: {
        folder: `portfolio/${folder}`,
        allowed_formats: folder === 'cv' 
          ? ['pdf', 'doc', 'docx']
          : ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: folder === 'cv' ? undefined : [{ quality: 'auto', fetch_format: 'auto' }],
      },
    });
  }
  return localStorage;
};

const uploadImage = (folder) => {
  const storage = createStorage(folder);
  return multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per photo
    fileFilter: (req, file, cb) => {
      const allowedMimes = [
        'image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 
        'image/gif', 'image/webp', 'image/heic', 'image/heif',
        'application/octet-stream'
      ];
      const ext = path.extname(file.originalname).toLowerCase();
      const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif', '.jfif', '.svg'];

      if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext) || file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Jenis file tidak valid. Hanya diperbolehkan format gambar (JPEG, PNG, GIF, WebP, HEIC).'));
      }
    },
  });
};


const uploadCVFile = () => {
  const storage = createStorage('cv');
  return multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Format file tidak valid. Hanya diperbolehkan PDF atau Word (.doc, .docx).'));
      }
    },
  });
};

const deleteImage = async (publicIdOrUrl) => {
  if (!publicIdOrUrl) return;
  
  if (isCloudinaryConfigured) {
    try {
      await cloudinary.uploader.destroy(publicIdOrUrl);
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error);
    }
  } else {
    try {
      const filename = publicIdOrUrl.split('/').pop();
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Failed to delete local image:', error);
    }
  }
};

module.exports = { cloudinary, uploadImage, uploadCVFile, deleteImage };
