// controllers/recetaController.js
const {Receta} = require('../models/Receta.js');
const Usuario = require('../models/Usuario.js');

// Crear una nueva receta
exports.createReceta = async (req, res) => {
  try {
    const receta = new Receta(req.body);
    await receta.save();
    res.status(201).json(receta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todas las recetas con filtros y paginación
exports.getRecetasSearch = async (req, res) => {
  try {
    const { page = 1, limit = 10, filtros} = req.query;
    
    const regex = /([#@]?)([^\s#@]+)/g;
    //filtros será un string: "Tarta @queso #saludable #facil"
    //la intención es separar cada palabra usando la regex

    let pipeline

    if (filtros){
      const tituloRecetas = [];
    const tags = [];
    const ingredientes = [];

    for (const match of filtros.matchAll(regex)) { //array de coincidencias
      const [ , prefix, word ] = match;
      if (prefix === "#") {
        tags.push(sanitizarPalabra(word)); //se añade al array tags si empieza por #
      } else if (prefix === "@") {
        ingredientes.push(sanitizarPalabra(word)); //se añade al array ingredientes si empieza por @
      } else {
        tituloRecetas.push(sanitizarPalabra(word)); //se añade al array tituloRecetas si es una palabra suelta
      }
    }
    
    pipeline = [
      {
        $addFields: {
          matchCountIngredientes: {
            $size: {
              $filter: {
                input: ingredientes, // array de palabras para @
                as: "ingrediente",
                cond: {
                  $anyElementTrue: {
                      $map: {
                        input: "$ingredientesTotales",
                        as: "item",
                        in: {
                          $regexMatch: {
                            input: "$$item.nombre",
                            regex: "$$ingrediente",
                            options: "i"
                          }
                        }
                      }
                  }
                }
              }
            }
          },
          matchCountTags: {
              $size: {
                $filter: {
                  input: tags, // array de palabras para #
                  as: "tag",
                  cond: {
                    $anyElementTrue:{
                      $map:{
                          input: "$etiquetas",
                          as: "item",
                          in: {
                              $regexMatch: {
                                  input: "$$item",
                                  regex: "$$tag",
                                  options: "i"
                                }
                          }
                      }
                    }
                  }
                }
              }
            },
          matchCountTituloRecetas: {
            $size: {
              $filter: {
                input: tituloRecetas, // array de palabras normales
                as: "tituloReceta",
                cond: {
                  $regexMatch: {
                    input: "$titulo",
                    regex: "$$tituloReceta",
                    options: "i"
                  }
                }
              }
            }
          },
          cantidadIngredientes: {
            $size: "$ingredientesTotales"
          }
        }
      },
      // 2. Sumar los totales de coincidencias
      {
        $addFields: {
          totalMatches: {
            $add: ["$matchCountTituloRecetas", "$matchCountIngredientes"]
          }
        }
      },
      // 3. Filtrar las recetas que tuvieron al menos una coincidencia
      {
        $match: { totalMatches: { $gt: 0 } }
      },
      // 4. Ordenar de mayor a menor según totalMatches
      {
        $sort: { totalMatches: -1 }
      },
      // 5. Proyectar solo los campos necesarios
      {
        $project: {
          _id: 1,
          titulo: 1,
          fotoPrincipal: 1,
          cantidadIngredientes: 1,
          tiempoTotal: 1
        }
      }
    ]
    }
    
    else pipeline = []

    const recetas = await Receta.aggregate(pipeline)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(recetas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener una receta por ID
exports.getRecetaById = async (req, res) => {
  try {
    const receta = await Receta.findById(req.params.id);
    if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });
    res.json(receta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar receta
exports.updateReceta = async (req, res) => {
  try {
    const receta = await Receta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });
    res.json(receta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar receta
exports.deleteReceta = async (req, res) => {
  try {
    const receta = await Receta.findByIdAndDelete(req.params.id);
    if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });
    res.json({ message: 'Receta eliminada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.likeReceta = async (req, res) => {
  try {
    const receta = await Receta.findById(req.body.idReceta);
    if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });

    const usuario = await Usuario.findById(req.body.idUsuario);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    usuario.actividad.recetasMeGusta.push(receta);
    await usuario.save();
    
    res.status(200).json(receta);
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.dislikeReceta = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.body.idUsuario);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const receta = usuario.actividad.recetasMeGusta.find(r => r._id.equals(req.body.idReceta));
    const index = usuario.actividad.recetasMeGusta.indexOf(receta);
    if (index === -1) return res.status(404).json({ error: 'Receta no encontrada en el listado de likes' });

    usuario.actividad.recetasMeGusta.splice(index, 1);
    await usuario.save();
    
    res.status(200).json(req.body.idReceta);
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.favoriteReceta = async (req, res) => {
  try {
    const receta = await Receta.findById(req.body.idReceta);
    if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });

    const usuario = await Usuario.findById(req.body.idUsuario);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    usuario.actividad.recetasFavoritas.push(receta);
    await usuario.save();
    
    res.status(200).json(receta);
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.unfavoriteReceta = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.body.idUsuario);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const receta = usuario.actividad.recetasFavoritas.find(r => r._id.equals(req.body.idReceta));
    const index = usuario.actividad.recetasFavoritas.indexOf(receta); 
    if (index === -1) return res.status(404).json({ error: 'Receta no encontrada en el listado de favoritos' });

    usuario.actividad.recetasFavoritas.splice(index, 1);
    await usuario.save();
    
    res.status(200).json(req.body.idReceta);
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

function sanitizarPalabra(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}