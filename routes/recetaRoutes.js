// routes/recetaRoutes.js
const express = require('express');
const router = express.Router();
const recetaController = require('../controllers/recetaController.js');

router.post('/', recetaController.createReceta);
router.get('/', recetaController.getRecetas);
router.get('/:id', recetaController.getRecetaById);
router.put('/:id', recetaController.updateReceta);
router.delete('/:id', recetaController.deleteReceta);

module.exports = router;
