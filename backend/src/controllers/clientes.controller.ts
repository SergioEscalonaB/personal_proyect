import { Request, Response } from "express";
import { getClientesSQL } from "../sql/clientes.sql";

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