// routes/actividadFisicaRoutes.js
const express = require('express');
const router = express.Router();
const actividadFisicaController = require('../controllers/actividadFisicaController.js');
const authToken = require('../middlewares/authToken.js');

router.get('/', authToken, actividadFisicaController.getActividadFisica);

module.exports = router;
