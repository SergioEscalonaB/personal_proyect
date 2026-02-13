import { Request, Response } from "express";
import {
  getclientesPorCobroSQL,
  getCobrosSQL,
  getDescripcionTarjetaSQL,
  getTarjetaNavegacionSQL,
  getTarjetasConSaldoSQL,
  getSaldoRestanteSQL,
  crearClienteConTarjetaSQL,
  crearDescripcionAbonoSQL,
  reorganizarCobroSQL,
} from "../sql/abonopage.sql";

// Obtener todos los cobros
export const getCobros = async (req: Request, res: Response) => {
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

// Obtener la descripcion de una tarjeta especifica
export const getDescripcionTarjeta = async (req: Request, res: Response) => {
  const { tarcodigo } = req.params;
  try {
    const tarcodigoValue = Array.isArray(req.params.tarcodigo)
      ? req.params.tarcodigo[0]
      : req.params.tarcodigo;
    const data = await getDescripcionTarjetaSQL(tarcodigoValue);
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener el saldo restante de una tarjeta
export const getSaldoRestante = async (req: Request, res: Response) => {
  const { tarcodigo } = req.params;
  try {
    const tarcodigoValue = Array.isArray(req.params.tarcodigo)
      ? req.params.tarcodigo[0]
      : req.params.tarcodigo;
    const data = await getSaldoRestanteSQL(tarcodigoValue);
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo cliente con tarjeta, desplazando las tarjetas existentes (ordenado por ITEN)
export const crearClienteNuevo = async (req: Request, res: Response) => {
  const {
    cli_codigo,
    cli_nombre,
    cli_calle,
    cob_codigo,
    tar_valor,
    tar_cuota,
    tar_fecha,
    tar_iten,
    tar_tiempo,
    tar_fp,
    tar_pres,
    tar_utilidad,
  } = req.body;
  try {
    const data = await crearClienteConTarjetaSQL(
      cli_codigo,
      cli_nombre,
      cli_calle,
      cob_codigo,
      tar_valor,
      tar_cuota,
      tar_fecha,
      tar_iten,
      tar_tiempo,
      tar_fp,
      tar_pres,
      tar_utilidad,
    );
    res.json({ message: "Cliente creado exitosamente", data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Creando la descripcion de los abonos
export const crearDescripcionAbono = async (req: Request, res: Response) => {
  const { tar_codigo, fecha_act, des_fecha, des_abono, des_resta } = req.body;
  try {
    const data = await crearDescripcionAbonoSQL(
      tar_codigo,
      fecha_act,
      des_fecha,
      des_abono,
      des_resta,
      );
    res.json({ message: "Descripción de abono creada exitosamente", data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  };
};

// Reorganizar cobro
export const reorganizarCobro = async (req: Request, res: Response) => {
  const { cob_codigo } = req.body;
  try {
    const data = await reorganizarCobroSQL(cob_codigo);
    res.json({ message: "Cobro reorganizado exitosamente", data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  };
};
