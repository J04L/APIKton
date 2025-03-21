// models/ActividadFisica.js
const mongoose = require('mongoose');

const ActividadFisicaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  factor: { type: Number, required: true },
});

module.exports = mongoose.model('ActividadFisica', ActividadFisicaSchema);
