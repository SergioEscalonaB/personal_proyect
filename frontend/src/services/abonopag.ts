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

// Obtener el conteo de todos los clientes
export async function getTotalTarjetas(cob_codigo: string): Promise<number> {
  const res = await fetch(`${API_URL}/abonopage/${cob_codigo}/total-tarjetas`);
  if (!res.ok) {
    throw new Error(`Error obteniendo el conteo de tarjetas: ${res.statusText}`);
  }
  const json = await res.json();
  return json.data[0].total;
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

// Mostrar la descripcion de la tarjeta del cliente
export async function getDescripcionTarjeta(tarcodigo: string): Promise<any> {
  const res = await fetch(`${API_URL}/abonopage/tarjeta/${tarcodigo}/descripcion`);
  if (!res.ok) {
    throw new Error(`Error obteniendo la descripcion de la tarjeta: ${res.statusText}`);
  }
  const json = await res.json();
  return json.data;
}
