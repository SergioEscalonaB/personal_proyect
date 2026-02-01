const prisma = require("../prisma/client");
// Controlador para obtener todos los registros de la tabla COBRO
const getCobros = async (req, res) => {
  try {
    const rows = await prisma.cOBRO.findMany();
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para crear un nuevo registro en la tabla COBRO
const createCobro = async (req, res) => {
  try {
    const data = await prisma.cOBRO.create({
      data: req.body
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Exportar las funciones del controlador
module.exports = {
  getCobros, createCobro
};
