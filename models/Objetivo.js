// models/Objetivo.js
const mongoose = require('mongoose');

const ObjetivoSchema = new mongoose.Schema({
  nombre: { type: String, required: true},
  factor: { type: Number, required: true },
  descripcion: { type: String, required: true },
});

const Objetivo = mongoose.model('Objetivo', ObjetivoSchema);
module.exports = {Objetivo, ObjetivoSchema};

