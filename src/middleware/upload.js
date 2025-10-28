const upload = {};
const response = require('../utils/response');
const cloudinary = require('../configs/cloudinary');
const { multer, storage, fileFilter } = require('../configs/multer');

// Multer
upload.multer = (req, res, next) => {
  multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 2 * 1024 * 1024, // 2MB max file size
      files: 1,
    },
  }).single('profile_image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return response(res, 400, 103, 'Ukuran file terlalu besar. Maksimal 2MB');
      }
      return response(res, 400, 103, `Error upload file: ${err.message}`);
    } else if (err) {
      return response(res, 400, 102, err.message);
    }
    next();
  });
};

// Cloudinary
upload.cloudinary = async (req, res, next) => {
  if (!req.file) {
    return response(res, 400, 102, 'Tidak ada file yang diupload');
  }

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'image',
            folder: 'profile_images',
            transformation: [
              { width: 500, height: 500, crop: 'limit' },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    req.body.profile_image = result.secure_url;
    next();
  } catch (error) {
    if (error.message.includes('api_key')) {
      return response(res, 500, 103, 'Konfigurasi upload gambar sedang bermasalah');
    }

    return response(res, 400, 103, `Gagal upload gambar: ${error.message}`);
  }
};

module.exports = upload;
