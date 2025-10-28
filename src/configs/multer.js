const multer = require("multer");
const storage = multer.memoryStorage();
const fileTypes = ["image/png", "image/jpeg", "image/jpg"];

const config = {
  multer,
  storage,
  fileFilter: (req, file, cb) => {
    if (fileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Format Image tidak sesuai"), false);
    }
  },
};

module.exports = config;
