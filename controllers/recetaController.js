// controllers/recetaController.js
const Receta = require('../models/Receta.js');

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
exports.getRecetas = async (req, res) => {
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
      }
    ]
    }
    else pipeline = []

    const recetas = await Receta.aggregate(pipeline)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

      console.log(page, limit, recetas)
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

function sanitizarPalabra(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}