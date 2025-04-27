const express = require('express');
const router = express.Router();
const {login, register, userSession} = require('../controllers/loginRegisterControllers.js');
const upload = require('../middlewares/imagesMiddlewares.js');

const authToken = require('../middlewares/authToken.js');

router.post('/register', upload.single('foto'), register);
router.post('/login', login);
router.get('/user', authToken, userSession);

module.exports = router;