import express from "express";
import { getClientes } from "../controllers/clientes.controller";

const router = express.Router();

// Obtener todos los clientes
router.get("/", getClientes);

export default router;