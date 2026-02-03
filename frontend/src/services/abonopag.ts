import { API_URL } from "./api";
import type { Cobro } from "../types/cobro";

// Obteniendo las rutas de los cobros
export async function getRutas(): Promise<Cobro[]> {
  const res = await fetch(`${API_URL}/abonopage/cobros`);
  if (!res.ok) {
    throw new Error(`Error obteniendo las rutas: ${res.statusText}`);
  }
  const json = await res.json();
  return json.data;
}

// Obtener todos los clientes con tarjetas activas y saldo para un cobro específico
export async function getClientesPorCobro(cob_codigo: string): Promise<any[]> {
  const res = await fetch(`${API_URL}/abonopage/${cob_codigo}/tarjetas-saldo`);
  if (!res.ok) {
    throw new Error(`Error obteniendo los clientes: ${res.statusText}`);
  }
  const json = await res.json();
  return json.data;
}

// Cargar tarjetas para un cobro específico con paginación
export async function getTarjetasconSaldo(
  cob_codigo: string,
  offset: number): Promise<any[]> {
    const res = await fetch(`${API_URL}/abonopage/${cob_codigo}/tarjeta/navegar/${offset}`);
    if (!res.ok) {
      throw new Error(`Error obteniendo las tarjetas: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data;
}