// routes/recetaRoutes.js
const express = require('express');
const router = express.Router();
const recetaController = require('../controllers/recetaController.js');
const authToken = require('../middlewares/authToken.js');

router.post('/', authToken, recetaController.createReceta);
router.get('/', authToken, recetaController.getRecetas);
router.get('/:id', authToken, recetaController.getRecetaById);
router.put('/:id', authToken, recetaController.updateReceta);
router.delete('/:id', authToken, recetaController.deleteReceta);

module.exports = router;
