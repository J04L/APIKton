const mongoose = require('mongoose');
const { Schema } = mongoose;
const {ObjetivoSchema} = require('./Objetivo.js');
const {ActividadFisicaSchema} = require('./ActividadFisica.js');

const {RecetaSchema} = require('./Receta.js');

// Subesquema para UserObjetive
const UserObjetiveSchema = new Schema({
  objetivoCalorico: { type: Number, default: null },
  objetivo: { type: ObjetivoSchema, default: null },
  caloriasConsumidas: { type: Number, default: null },
  pesoObjetivo: { type: Number, default: null },
  logros: { type: [String], default: [] },
  actividadFisica: { type: ActividadFisicaSchema, default: null }
}, { _id: false });

// Subesquema para AcurateInfo
const AcurateInfoSchema = new Schema({
  tiempoDisponibleParaCocinar: { type: Number, default: null },
  restriccionesAlimentarias: { type: [String], default: [] }
}, { _id: false });

// Subesquema para UserActivity
const UserActivitySchema = new Schema({
  historialRecetas: { type: [RecetaSchema], default: [] },
  recetasFavoritas: { type: [RecetaSchema], default: [] },
  recetasMeGusta: { type: [RecetaSchema], default: [] },
  recetasPropias: { type: [RecetaSchema], default: [] }
}, { _id: false });

// Esquema principal de Usuario
const UsuarioSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  foto: { type: String, required: false },
  edad: { type: Number, default: null },
  peso: { type: Number, default: null },
  altura: { type: Number, default: null },
  sexo: { type: String, default: null },
  objetivo: { type: UserObjetiveSchema, required: true },
  extraInfo: { type: AcurateInfoSchema, required: true },
  actividad: { type: UserActivitySchema, required: true }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;
