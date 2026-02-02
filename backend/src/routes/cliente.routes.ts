import express from "express";
import { getClientes, getClientePorCodigo, createClientesolo, deleteCliente, updateCliente } from "../controllers/clientes.controller";

const router = express.Router();

// Obtener todos los clientes
router.get("/", getClientes);

// Obtener un cliente por su código
router.get("/:codigo", getClientePorCodigo);

// Crear un nuevo cliente sin tarjeta
router.post("/", createClientesolo);

// Actualizar un cliente por su codigo
router.put("/:codigo", updateCliente);

// Eliminar un cliente por su codigo
router.delete("/:codigo", deleteCliente);

export default router;