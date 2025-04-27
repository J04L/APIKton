
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const authToken = (req, res, next) => {
    //obtenemos el token de la cabecera
    const authorization= req.headers.authorization
    
    //comprobamos si el token es válido
    if (!authorization) return res.status(401).json({ error: 'No hay token' });

    const token = authorization.split(' ')[1];

    //decodificamos el token
    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(401).json({ error: 'Token no válido' });
        req.usuario = usuario;
        next();
      });
    
}


module.exports = authToken;