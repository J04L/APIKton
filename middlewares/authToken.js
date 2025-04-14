const authToken = (req, res, next) => {
    //obtenemos el token de la cabecera
    const token = req.headers.token;
    
    //comprobamos si el token es válido
    if (!token) return res.status(401).json({ error: 'No hay token' });

    //decodificamos el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(401).json({ error: 'Token no válido' });
        req.id = usuario.id;
        next();
      });
    
}

module.exports = authToken;