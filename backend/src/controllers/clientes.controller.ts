import { Request, Response } from "express";
import {
  getClientePorCodigoSQL,
  getClientesSQL,
  createClienteSQL,
  deleteClienteSQL,
  updateClienteSQL,
} from "../sql/clientes.sql";

// Obtener todos los clientes
export const getClientes = async (_req: Request, res: Response) => {
  try {
    const data = await getClientesSQL();
    res.json({ data });
  } catch (error: any) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: message });
  }
};

// Obtener un cliente por su código
export const getClientePorCodigo = async (req: Request, res: Response) => {
  const { codigo } = req.params;
  try {
    const codigoCLiente = Array.isArray(req.params.codigo)
      ? req.params.codigo[0]
      : req.params.codigo;
    const data = await getClientePorCodigoSQL(codigoCLiente);
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo cliente sin tarjeta
export const createClientesolo = async (req: Request, res: Response) => {
  try {
    const cliente = req.body;
    const data = await createClienteSQL(cliente);
    res.status(201).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar los datos de un cliente por su codigo
export const updateCliente = async (req: Request, res: Response) => {
  try {
    const codigoCliente = Array.isArray(req.params.codigo)
      ? req.params.codigo[0]
      : req.params.codigo;
    const cliente = req.body;
    const data = await updateClienteSQL(codigoCliente, cliente);
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un cliente por su codigo
export const deleteCliente = async (req: Request, res: Response) => {
  try {
    const codigoCliente = Array.isArray(req.params.codigo)
      ? req.params.codigo[0]
      : req.params.codigo;
    const data = await deleteClienteSQL(codigoCliente);
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
