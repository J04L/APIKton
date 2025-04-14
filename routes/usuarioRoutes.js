// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController.js');
const authToken = require('../middlewares/authToken.js');

// CRUD de usuarios
router.post('/', authToken, usuarioController.createUsuario);
router.get('/', authToken, usuarioController.getUsuarios);
router.get('/:id', authToken, usuarioController.getUsuarioById);
router.put('/:id', authToken, usuarioController.updateUsuario);
router.delete('/:id', authToken, usuarioController.deleteUsuario);

// Rutas anidadas para recetas del usuario
router.get('/:usuarioId/recetas', authToken, usuarioController.getRecetasByUsuario);
router.post('/:usuarioId/recetas', authToken, usuarioController.addRecetaToUsuario);
router.delete('/:usuarioId/recetas/:recetaId', authToken, usuarioController.removeRecetaFromUsuario);

// Endpoints dedicados para actualizar actividad física y objetivo
router.put('/:usuarioId/actividadFisica', authToken, usuarioController.updateUsuarioActividadFisica);
router.put('/:usuarioId/objetivo', authToken, usuarioController.updateUsuarioObjetivo);

module.exports = router;
