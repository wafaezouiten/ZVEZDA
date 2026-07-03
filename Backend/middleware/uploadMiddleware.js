const multer = require("multer");
const path = require("path");

// Destination et nommage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});


// Filtrage des types de fichiers acceptés (images uniquement)
// function checkFileType(file, cb) {
//   const filetypes = /jpg|jpeg|png/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb("Images uniquement (jpg, jpeg, png)");
//   }
// }

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = upload;