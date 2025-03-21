// models/Objetivo.js
const mongoose = require('mongoose');

const ObjetivoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  rango: { type: String }, // Podrías especificar un rango o dejarlo como descriptor
});

module.exports = mongoose.model('Objetivo', ObjetivoSchema);
