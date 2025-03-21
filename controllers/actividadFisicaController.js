// controllers/actividadFisicaController.js
const ActividadFisica = require('../models/ActividadFisica.js');

exports.getActividadFisica = async (req, res) => {
  try {
    const actividades = await ActividadFisica.find();
    res.json(actividades);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
