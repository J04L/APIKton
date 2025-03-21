// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController.js');

// CRUD de usuarios
router.post('/', usuarioController.createUsuario);
router.get('/', usuarioController.getUsuarios);
router.get('/:id', usuarioController.getUsuarioById);
router.put('/:id', usuarioController.updateUsuario);
router.delete('/:id', usuarioController.deleteUsuario);

// Rutas anidadas para recetas del usuario
router.get('/:usuarioId/recetas', usuarioController.getRecetasByUsuario);
router.post('/:usuarioId/recetas', usuarioController.addRecetaToUsuario);
router.delete('/:usuarioId/recetas/:recetaId', usuarioController.removeRecetaFromUsuario);

// Endpoints dedicados para actualizar actividad física y objetivo
router.put('/:usuarioId/actividadFisica', usuarioController.updateUsuarioActividadFisica);
router.put('/:usuarioId/objetivo', usuarioController.updateUsuarioObjetivo);

module.exports = router;
