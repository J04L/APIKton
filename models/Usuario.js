// models/Usuario.js
const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true},
  edad: { type: Number, required: true},
  restriccionesAlimentarias: { type: [String] },
  email: { type: String, unique: true, required: true},
  password: { type: String, required: true},
  foto : { type: String, required: false},
  peso: { type: Number, required: false},
  altura: { type: Number, required: false},
  sexo: { type: String, required: false},
  objetivo: { type: String, required: false},
  actividadFisica: { type: String, required: false},
  tiempoDisponibleParaCocinar: {type: Number, required: false},
  recetasFavoritas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Receta' }],
  recetasCreadas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Receta' }],
}, { timestamps: true });

module.exports = mongoose.model('Usuario', UsuarioSchema);
