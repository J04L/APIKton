// routes/objetivoRoutes.js
const express = require('express');
const router = express.Router();
const objetivoController = require('../controllers/objetivoController.js');
const authToken = require('../middlewares/authToken.js');

router.get('/', authToken, objetivoController.getObjetivos);

module.exports = router;
