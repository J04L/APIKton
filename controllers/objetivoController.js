// controllers/objetivoController.js
const Objetivo = require('../models/Objetivo.js');

exports.getObjetivos = async (req, res) => {
  try {
    const objetivos = await Objetivo.find();
    res.json(objetivos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
