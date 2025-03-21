// models/Receta.js
const mongoose = require('mongoose');

const PorcentajeEnergeticoSchema = new mongoose.Schema({
  energia: Number,
  proteinas: Number,
  carbohidratos: Number,
  grasas: Number,
}, { _id: false });

const IngredienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: false },
  peso: { type: Number, required: false },
  porcentajeEnergetico: PorcentajeEnergeticoSchema,
}, { _id: false });

const PasoSchema = new mongoose.Schema({
  accion: { type: String, required: true },
  ingredientes: { type: [IngredienteSchema], required: false }, // Puede ser array de objetos o strings
  herramienta: { type: String },
  frase: { type: String },
  tiempo: { type: Number },
}, { _id: false });

const ResultadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  pasos: { type: [PasoSchema], required: true },
}, { _id: false });

const InformacionNutricionalSchema = new mongoose.Schema({
  informacionNutricional: {
    energia: Number,
    proteinas: Number,
    carbohidratos: Number,
    grasas: Number,
  }
}, { _id: false });

const RecetaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  etiquetas: {type: [String]},
  restriccionesAlimentarios: {type: [String]},
  tiempoTotal: { type: Number, required: true },
  ingredientesTotales: { type: [IngredienteSchema], required: true },
  herramientasTotales: { type: [String], required: true },
  resultados: { type: [ResultadoSchema], required: true },
  informacionNutricional: InformacionNutricionalSchema,
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: false },
}, { timestamps: true, collection: "recetas"});

module.exports = mongoose.model('Receta', RecetaSchema);
