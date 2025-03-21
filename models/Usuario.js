// models/Usuario.js
const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  edad: { type: Number, required: true },
  preferenciasAlimentarias: { type: String },
  peso: { type: Number },
  altura: { type: Number },
  sexo: { type: String },
  objetivo: { type: mongoose.Schema.Types.ObjectId, ref: 'Objetivo' },
  actividadFisica: { type: mongoose.Schema.Types.ObjectId, ref: 'ActividadFisica' },
  historialRecetas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Receta' }],
  recetasFavoritas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Receta' }],
  recetasCreadas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Receta' }],
}, { timestamps: true });

module.exports = mongoose.model('Usuario', UsuarioSchema);
