const multer = require('multer');
const path = require('path');

//config para recibir y almacenar archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define la carpeta donde se guardarán las imágenes
    cb(null, path.join(__dirname, '../uploads/')); // Asegúrate de que esta carpeta exista
  },
  filename: (req, file, cb) => {
    // Define cómo se nombrará el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    // Ejemplo: 'imagenDePerfil-1678886400000-123456789.jpg'
  }
});
const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5, // Límite de 5MB
      // files: 5 // Límite de 5 archivos (si usas array o fields)
    },
    fileFilter: (req, file, cb) => {
      // Filtra los tipos de archivo permitidos
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/webp' || file.mimetype === 'image/avif') {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Solo se permiten archivos .png, .jpeg, .jpg, .webp y .avif'));
      }
    }
  });

  module.exports = upload;