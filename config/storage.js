const path = require("path");
const multer = require("multer");

// Configuración de Multer
const storageDir = path.join(__dirname, "..", "imagenes");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storageDir); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.png`); // Renombrar archivo para evitar duplicados
  },
});

const upload = multer({ storage });

module.exports = upload;