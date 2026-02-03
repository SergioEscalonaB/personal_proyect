import { API_URL } from "./api";
import type { Cobro } from "../types/cobro";

export async function getCobros(id: string): Promise<Cobro[]> {
  const res = await fetch(`${API_URL}/cobros/${id}`);
  if (!res.ok) {
    throw new Error(`Error obteniendo el cobro: ${res.statusText}`);
  }
  return res.json();
}

export async function todoscobros(): Promise<Cobro[]> {
  const res = await fetch(`${API_URL}/cobros`);
  if (!res.ok) {
    throw new Error(`Error obteniendo los cobros: ${res.statusText}`);
  }
  const json = await res.json();
  return json.data;
}
