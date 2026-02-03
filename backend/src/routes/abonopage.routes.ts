import express from 'express';
import { getCobros, getclientesPorCobro, getTarjetasConSaldo, navegarTarjetasConSaldo } from '../controllers/abonopage.controller';  

const router = express.Router();

// Obtener todos los cobros
router.get('/cobros', getCobros);

// Obtener todos los clientes de un cobro especifico
router.get('/:cobroCodigo/clientes', getclientesPorCobro);

// Obtener total tarjetas con saldo
router.get('/:cobroCodigo/total-tarjetas', getTarjetasConSaldo);

// Navegar entre tarjetas con saldo
router.get('/:cobroCodigo/tarjeta/navegar/:offset', navegarTarjetasConSaldo);

export default router;


