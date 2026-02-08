import express from "express";
import {
  getCobros,
  getclientesPorCobro,
  getTarjetasConSaldo,
  navegarTarjetasConSaldo,
  getDescripcionTarjeta,
  getSaldoRestante,
  crearClienteNuevo,
  crearDescripcionAbono,
} from "../controllers/abonopage.controller";

const router = express.Router();

// Obtener todos los cobros
router.get('/cobros', getCobros);

// Obtener todos los clientes de un cobro especifico
router.get("/:cobroCodigo/clientes", getclientesPorCobro);

// Obtener total tarjetas con saldo
router.get("/:cobroCodigo/total-tarjetas", getTarjetasConSaldo);

// Navegar entre tarjetas con saldo
router.get("/:cobroCodigo/tarjeta/navegar/:offset", navegarTarjetasConSaldo);

// Obtener la descripcion de una tarjeta especifica
router.get("/tarjeta/:tarcodigo/descripcion", getDescripcionTarjeta);

// Obtener el saldo restante de una tarjeta
router.get("/tarjeta/:tarcodigo/saldo-restante", getSaldoRestante);

// Crear un nuevo cliente con tarjeta, desplazando las tarjetas existentes (ordenado por ITEN)
router.post("/cliente/nuevo", crearClienteNuevo);

// Creando la descripcion de los abonos
router.post("/descripcion/crear", crearDescripcionAbono);


export default router;
