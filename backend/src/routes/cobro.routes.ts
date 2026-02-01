const express = require("express");
const router = express.Router();
const { getCobros, createCobro, updateCobro, deleteCobro} = require("../controllers/cobro.controller");

// Definir la ruta para obtener los cobros
router.get("/", getCobros);

// Definir la ruta para crear un nuevo cobro
router.post("/", createCobro);

// Definir la ruta para actualizar un cobro por codigo
router.put("/:codigo", updateCobro);

// Definir la ruta para eliminar un cobro por codigo
router.delete("/:codigo", deleteCobro);

// Exportar el router
export default router;
