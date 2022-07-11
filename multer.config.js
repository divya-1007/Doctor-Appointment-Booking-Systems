const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(file.mimetype === 'image/jpeg'){
            cb(null, "uploads/");
        }else if(file.mimetype === 'image/png'){
            cb(null, "uploads/");
        }else if(file.mimetype === 'image/jpg'){
            cb(null, "uploads/");
        }
 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "profilePicture.png" ||
      file.mimetype === "profilePicture.jpg" ||
      file.mimetype === "profilePicture.jpeg"
    ) {
      cb(null, "profilePicture fond jpeg,jpg,png", true);
    } else {
      cb(null, "error message", false);
    }
  },
});
module.exports = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5,
  },
});
