const express = require("express");
const router = express.Router();
const { getCobros, createCobro} = require("../controllers/cobro.controller");

// Definir la ruta para obtener los cobros
router.get("/", getCobros);

// Definir la ruta para crear un nuevo cobro
router.post("/", createCobro);

// Exportar el router
module.exports = router;
