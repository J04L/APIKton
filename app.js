// app.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(express.json());

// Rutas
app.use('/usuarios', require('./routes/usuarioRoutes.js'));
app.use('/recetas', require('./routes/recetaRoutes.js'));
app.use('/actividadFisica', require('./routes/actividadFisicaRoutes.js'));
app.use('/objetivos', require('./routes/objetivoRoutes.js'));

// Manejo básico de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

const PORT = process.env.PORT || 5000;
// Crea el servidor HTTPS
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
