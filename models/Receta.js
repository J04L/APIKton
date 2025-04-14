// models/Receta.js
const mongoose = require('mongoose');

const PorcentajeEnergeticoSchema = new mongoose.Schema({
  energia: { type: Number, required: true },
  proteinas: { type: Number, required: true },
  carbohidratos: { type: Number, required: true },
  grasas: { type: Number, required: true },
}, { _id: false });

const IngredienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: false },
  peso: { type: Number, required: false },
  porcentajeEnergetico: { type: PorcentajeEnergeticoSchema, required: false },
}, { _id: false });

const PasoSchema = new mongoose.Schema({
  verbo: { type: String, required: true },
  ingredientes: { type: [IngredienteSchema], required: true },
  herramienta: { type: String, required: true },
  frase: { type: String, required: true },
  tiempo: { type: Number, required: false },
  numero: { type: Number, required: false },
}, { _id: false });

const ResultadoSchema = new mongoose.Schema({
  nombreResultado: { type: String, required: true },
  pasos: { type: [PasoSchema], required: true },
  numero: { type: Number, required: false },
}, { _id: false });

const RecetaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  etiquetas: {type: [String], required: false},
  restriccionesAlimentarios: {type: [String], required: false},
  tiempoTotal: { type: Number, required: true },
  ingredientesTotales: { type: [IngredienteSchema], required: true },
  herramientasTotales: { type: [String], required: true },
  resultados: { type: [ResultadoSchema], required: true },
  informacionNutricional: { type: PorcentajeEnergeticoSchema, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: false },
}, { timestamps: true, collection: "recetas"});

module.exports = mongoose.model('Receta', RecetaSchema);
