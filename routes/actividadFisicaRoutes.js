// routes/actividadFisicaRoutes.js
const express = require('express');
const router = express.Router();
const actividadFisicaController = require('../controllers/actividadFisicaController.js');

router.get('/', actividadFisicaController.getActividadFisica);

module.exports = router;
