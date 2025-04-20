const express = require('express');
const router = express.Router();
const {login, register} = require('../controllers/loginRegisterControllers.js');
const authToken = require('../middlewares/authToken.js');

router.post('/register', register);
router.post('/login', login);

module.exports = router;