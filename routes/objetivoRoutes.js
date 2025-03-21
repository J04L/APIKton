// routes/objetivoRoutes.js
const express = require('express');
const router = express.Router();
const objetivoController = require('../controllers/objetivoController.js');

router.get('/', objetivoController.getObjetivos);

module.exports = router;
