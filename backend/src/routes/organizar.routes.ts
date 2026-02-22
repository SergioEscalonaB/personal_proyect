import express from "express";
import { ejecutarMantenimientoCompleto } from "../controllers/organizar.controller";

const router = express.Router();

// Ejecutar mantenimiento completo de la BD
router.post("/mantenimiento/ejecutar", ejecutarMantenimientoCompleto);

export default router;