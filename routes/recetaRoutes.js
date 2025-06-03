// routes/recetaRoutes.js
const express = require('express');
const router = express.Router();
const recetaController = require('../controllers/recetaController.js');
const authToken = require('../middlewares/authToken.js');

router.post('/crear', authToken, recetaController.createReceta);
router.get('/', authToken, recetaController.getRecetasSearch);
router.get('/:id', authToken, recetaController.getRecetaById);
router.put('/:id', authToken, recetaController.updateReceta);
router.delete('/:id', authToken, recetaController.deleteReceta);
router.post('/like', authToken, recetaController.likeReceta);
router.post('/dislike', authToken, recetaController.dislikeReceta);
router.post('/favorite', authToken, recetaController.favoriteReceta);
router.post('/unfavorite', authToken, recetaController.unfavoriteReceta);


module.exports = router;
