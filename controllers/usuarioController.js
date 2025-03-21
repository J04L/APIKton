// controllers/usuarioController.js
const Usuario = require('../models/Usuario.js');
const Receta = require('../models/Receta.js');

// Crear un usuario
exports.createUsuario = async (req, res) => {
  try {
    const usuario = new Usuario(req.body);
    await usuario.save();
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener usuarios con filtros (todos los campos filtrables) y paginación
exports.getUsuarios = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const query = { ...filters };
    const usuarios = await Usuario.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Usuario.countDocuments(query);
    res.json({ data: usuarios, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener usuario por ID
exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id)
      .populate('objetivo')
      .populate('actividadFisica');
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar usuario (datos generales)
exports.updateUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar usuario
exports.deleteUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Endpoints para asociar/disociar recetas a un usuario

// Asociar una receta a un usuario (agregar a recetasCreadas, por ejemplo)
exports.addRecetaToUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const recetaData = req.body;
    recetaData.usuario = usuarioId;
    const nuevaReceta = await Receta.create(recetaData);
    // Opcionalmente agregar la receta a la lista de recetas creadas del usuario
    await Usuario.findByIdAndUpdate(usuarioId, { $push: { recetasCreadas: nuevaReceta._id } });
    res.status(201).json(nuevaReceta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar la asociación de una receta a un usuario
exports.removeRecetaFromUsuario = async (req, res) => {
  try {
    const { usuarioId, recetaId } = req.params;
    const receta = await Receta.findByIdAndDelete(recetaId);
    if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });
    await Usuario.findByIdAndUpdate(usuarioId, { 
      $pull: { recetasCreadas: recetaId, recetasFavoritas: recetaId, historialRecetas: recetaId }
    });
    res.json({ message: 'Receta desasociada y eliminada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener recetas de un usuario (con filtros similares a GET /recetas)
exports.getRecetasByUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { page = 1, limit = 10, ...filters } = req.query;
    const query = { usuario: usuarioId, ...filters };
    const recetas = await Receta.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Receta.countDocuments(query);
    res.json({ data: recetas, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Endpoints para actualizar actividad física y objetivo de un usuario

exports.updateUsuarioActividadFisica = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { actividadFisicaId } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(usuarioId, { actividadFisica: actividadFisicaId }, { new: true });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUsuarioObjetivo = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { objetivoId } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(usuarioId, { objetivo: objetivoId }, { new: true });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
