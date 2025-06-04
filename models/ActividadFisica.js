// models/ActividadFisica.js
const mongoose = require('mongoose');

const ActividadFisicaSchema = new mongoose.Schema({
  nombre: { type: String, required: true},
  factor: { type: Number, required: true },
  descripcion: { type: String, required: true },
});
const ActividadFisica = mongoose.model('ActividadFisica', ActividadFisicaSchema);
module.exports = {ActividadFisica, ActividadFisicaSchema};
