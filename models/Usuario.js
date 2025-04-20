// models/Usuario.js
const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true},
  email: { type: String, unique: true, required: true},
  password: { type: String, required: true},
  foto : { type: String, required: true},
  edad: { type: Number, required: false},
  peso: { type: Number, required: false},
  altura: { type: Number, required: false},
  sexo: { type: String, required: false},
  objetivo: { type: String, required: false},
  actividadFisica: { type: String, required: false},
  tiempoDisponibleParaCocinar: {type: Number, required: false},
  restriccionesAlimentarias: { type: [String] },
  recetasFavoritas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Receta' }],
  recetasCreadas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Receta' }],
}, { timestamps: true });

module.exports = mongoose.model('Usuario', UsuarioSchema);
