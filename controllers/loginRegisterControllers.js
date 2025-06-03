// controllers/loginRegisterControllers.js
const Usuario = require('../models/Usuario.js');
const argon2 = require('argon2')
const jwt = require('jsonwebtoken');
const {ActividadFisica} = require('../models/ActividadFisica.js');
const {Objetivo} = require('../models/Objetivo.js');
exports.login = async (req, res) => {
  try {
    const {username, password} = req.body

    //comprobamos si existe el usuario en la Base de datos
    const usuario = await Usuario.findOne({ nombre: username });
    if (!usuario){
      const email = await Usuario.findOne({ email: username });
      if(!email) return res.status(404).json({ error: 'Credenciales incorrectas' });
    }

    //comprobamos la contraseña
    const contrasenyaCorrecta = await argon2.verify(usuario.password, password);
    if (!contrasenyaCorrecta) return res.status(401).json({ error: 'Credenciales incorrectas' });

    //añadir token
    const token = jwt.sign({ id: usuario._id}, process.env.JWT_SECRET);
    const action_token = jwt.sign({ id: usuario.nombre}, process.env.JWT_SECRET);

    //enviar token y usuario
    res.json({ "token": token , "action_token": action_token, "usuario": usuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const {nombre, email, password, peso, altura, edad, sexo, objetivo, actividadFisica, caloriasConsumidas, pesoObjetivo, tiempoDisponibleParaCocinar, restriccionesAlimentarias} = req.body
    // Obtener la ruta del archivo subido por multer
    const foto = req.file ? req.file.filename : null

    //el nombre de usuario solo puede tener letras, números y barrabaja
    const regexUsuario = /^[a-zA-Z0-9_]*$/;
    if (!regexUsuario.test(nombre)) return res.status(400).json({ error: 'El nombre de usuario solo puede tener letras, números y barrabaja' });

    const regexEmail = /^[a-zA-Z0-9.!#$%u0026'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
    if (!regexEmail.test(email)) return res.status(400).json({ error: 'El email no tiene un formato correcto' });

    //la contraseña debe tener más de 6 caracteres y por lo menos contener un número y mayúsculas y menos 40 digitos
    const regexPassword = /^(?=.*\d)(?=.*[A-Z]).{6,40}$/;
    if (!regexPassword.test(password)) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres, por lo menos un número y una mayúscula' });

    // Validar que los datos necesarios para el cálculo estén presentes
    if (!peso || !altura || !edad || !sexo || !actividadFisica || !objetivo) {
      return res.status(400).json({ error: 'Se requieren peso, altura, edad, sexo y actividad física para calcular el objetivo calórico' });
    }

    // Obtener el factor de actividad física de la base de datos
    const actividadFisicaDoc = await ActividadFisica.findOne({ nombre: actividadFisica });
    if (!actividadFisicaDoc) {
      return res.status(400).json({ error: 'Actividad física no válida' });
    }
    const objetivoDoc = await Objetivo.findOne({ nombre: objetivo });
    if (!objetivoDoc) {
      return res.status(400).json({ error: 'Objetivo no válido' });
    }

    // Calcular BMR usando la fórmula de Harris-Benedict
    let bmr;
    if (sexo.toLowerCase() === 'masculino') {
      bmr = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * edad);
    } else if (sexo.toLowerCase() === 'femenino') {
      bmr = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * edad);
    } else {
      return res.status(400).json({ error: 'Sexo no válido' });
    }

    // Calcular objetivo calórico total
    const objetivoCalorico = Math.round(bmr * actividadFisicaDoc.factor * objetivoDoc.factor);

    const usuarioReq = {
      nombre : nombre,
      email : email,
      password : await argon2.hash(password),
      peso : parseInt(peso),
      altura : parseInt(altura),
      edad : parseInt(edad),
      sexo : sexo,
      objetivo: {
        objetivoCalorico: objetivoCalorico,
        objetivo: objetivoDoc,
        caloriasConsumidas: parseInt(caloriasConsumidas),
        pesoObjetivo: parseInt(pesoObjetivo),
        logros: [],
        actividadFisica: actividadFisicaDoc
      },
      extraInfo: {
        tiempoDisponibleParaCocinar: tiempoDisponibleParaCocinar ? parseInt(tiempoDisponibleParaCocinar) : null,
        restriccionesAlimentarias: restriccionesAlimentarias ? restriccionesAlimentarias.split(',') : [],
      },
      actividad: {
        historialRecetas: [],
        recetasFavoritas: [],
        recetasMeGusta: [],
        recetasPropias: []
      },
      foto: foto
    }

    const usuario = new Usuario(usuarioReq);
    await usuario.save()

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET);
    const action_token = jwt.sign({ id: usuario.nombre}, process.env.JWT_SECRET);

    res.status(201).json({ usuario, token, action_token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.userSession = async (req, res) => {
  try {

    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Generar un nuevo token
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET);

    // Enviar el token y el usuario
    res.json({ "token": token, "usuario": usuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};