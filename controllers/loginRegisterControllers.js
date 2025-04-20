// controllers/loginRegisterControllers.js
const Usuario = require('../models/Usuario.js');
const argon2 = require('argon2')
const jwt = require('jsonwebtoken');

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
    const token = jwt.sign({ id: usuario._id, nombre: usuario.nombre, email: usuario.email }, process.env.JWT_SECRET);

    //enviar token y usuario
    res.json({ "token": token , "usuario": usuario });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const {usuarioReq, password} = req.body

    //el nombre de usuario solo puede tener letras, números y barrabaja
    const regexUsuario = /^[a-zA-Z0-9_]*$/;
    if (!regexUsuario.test(usuarioReq.nombre)) return res.status(400).json({ error: 'El nombre de usuario solo puede tener letras, números y barrabaja' });

    const regexEmail = /^[a-zA-Z0-9.!#$%u0026'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
    if (!regexEmail.test(usuarioReq.email)) return res.status(400).json({ error: 'El email no tiene un formato correcto' });

    //la contraseña debe tener más de 6 caracteres y por lo menos contener un número y mayúsculas y menos 40 digitos
    const regexPassword = /^(?=.*\d)(?=.*[A-Z]).{6,40}$/;
    if (!regexPassword.test(password)) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres, por lo menos un número y una mayúscula' });

    //hasheamos la contraseña
    usuarioReq.password = await argon2.hash(password)
    
    const usuario = new Usuario(usuarioReq);
    await usuario.save() //insertamos el usuario

    res.status(201).json(usuarioReq);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};