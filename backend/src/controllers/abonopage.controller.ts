import { Request, Response} from 'express';
import { getclientesPorCobroSQL, getCobrosSQL, getTarjetaNavegacionSQL, getTarjetasConSaldoSQL } from '../sql/abonopage.sql';

// Obtener todos los cobros
export const getCobros = async (_req: Request, res: Response) => {
    try {
        const data = await getCobrosSQL();
        res.json({ data });
    } catch (error: any) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: message });
    }
};

// Obtener todos los clientes de un cobro especifico
export const getclientesPorCobro = async (req: Request, res: Response) => {
    const { cobroCodigo } = req.params;
    try {
        const cobroCodigoValue = Array.isArray(req.params.cobroCodigo)
            ? req.params.cobroCodigo[0]
            : req.params.cobroCodigo;
        const data = await getclientesPorCobroSQL(cobroCodigoValue);
        res.json({ data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// OBTENER TARJETAS CON SALDO PARA UN COBRO ESPECIFICO (Contar total)
export const getTarjetasConSaldo = async (req: Request, res: Response) => {
    const { cobroCodigo } = req.params;
    try {
        const cobroCodigoValue = Array.isArray(req.params.cobroCodigo)
            ? req.params.cobroCodigo[0]
            : req.params.cobroCodigo;
        const data = await getTarjetasConSaldoSQL(cobroCodigoValue);
        res.json({ data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Navegacion entre tarjetas con saldo
export const navegarTarjetasConSaldo = async (req: Request, res: Response) => {
    const { cobroCodigo, offset } = req.params;
    try {
        const cobroCodigoValue = Array.isArray(req.params.cobroCodigo)
            ? req.params.cobroCodigo[0]
            : req.params.cobroCodigo;
        const offsetValue = Array.isArray(req.params.offset)
            ? parseInt(req.params.offset[0], 10)
            : parseInt(req.params.offset, 10);
        const data = await getTarjetaNavegacionSQL(cobroCodigoValue, offsetValue);
        res.json({ data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
