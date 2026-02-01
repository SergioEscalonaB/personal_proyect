import { Request, Response } from "express";
import { getCobroSQL, createCobroSQL, deleteCobroSQL, updateCobroSQL } from "../sql/cobro.sql";

// Obtener todos los cobros
export const getCobros = async (_req: Request, res: Response) => {
  try {
    const data = await getCobroSQL();
    res.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: message });
  }
};

// Crear un nuevo cobro
export const createCobro = async (req: Request, res: Response) => {
  try {
    const cobro = req.body;
    const data = await createCobroSQL(cobro);
    res.status(201).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un cobro por codigo
export const deleteCobro = async (req: Request, res: Response) => {
  try {
    const cobroCodigo = Array.isArray(req.params.codigo)
      ? req.params.codigo[0]
      : req.params.codigo;
    const data = await deleteCobroSQL(cobroCodigo);
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un cobro por codigo
export const updateCobro = async (req: Request, res: Response) => {
  try {
    const cobroCodigo = Array.isArray(req.params.codigo) 
      ? req.params.codigo[0] 
      : req.params.codigo;
    const cobro = req.body;
    const data = await updateCobroSQL(cobroCodigo, cobro);
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};