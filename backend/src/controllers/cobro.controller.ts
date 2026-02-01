import { Request, Response } from "express";
import { getCobroSQL } from "../sql/cobro.sql";

export const getCobros = async (_req: Request, res: Response) => {
  try {
    const data = await getCobroSQL();
    res.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: message });
  }
};

export const createCobro = async (req: Request, res: Response) => {
  try {
    // Aquí irá la lógica para crear un cobro
    res.status(501).json({ message: "Función no implementada aún" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};