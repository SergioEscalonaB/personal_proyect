import { API_URL } from "./api";
import type { Cliente } from "../types/cliente";


export async function getClientes(id: string): Promise<Cliente[]> {
  const res = await fetch(`${API_URL}/clientes/${id}`);
  if (!res.ok) {
    throw new Error(`Error obteniendo al cliente: ${res.statusText}`);
  }
  return res.json();
}
