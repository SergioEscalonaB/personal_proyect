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
    throw new Error(
      `Error obteniendo el conteo de tarjetas: ${res.statusText}`,
    );
  }
  const json = await res.json();
  return json.data[0].total;
}

// Cargar tarjetas para un cobro específico con paginación
export async function getTarjetasconSaldo(
  cob_codigo: string,
  offset: number,
): Promise<any[]> {
  const res = await fetch(
    `${API_URL}/abonopage/${cob_codigo}/tarjeta/navegar/${offset}`,
  );
  if (!res.ok) {
    throw new Error(`Error obteniendo las tarjetas: ${res.statusText}`);
  }
  const json = await res.json();
  return json.data;
}

// Mostrar la descripcion de la tarjeta del cliente
export async function getDescripcionTarjeta(tarcodigo: string): Promise<any> {
  const res = await fetch(
    `${API_URL}/abonopage/tarjeta/${tarcodigo}/descripcion`,
  );
  if (!res.ok) {
    throw new Error(
      `Error obteniendo la descripcion de la tarjeta: ${res.statusText}`,
    );
  }
  const json = await res.json();
  return json.data;
}

// Obtener el saldo restante de la tarjeta
export async function getSaldoRestante(tarcodigo: string): Promise<any> {
  const res = await fetch(
    `${API_URL}/abonopage/tarjeta/${tarcodigo}/saldo-restante`,
  );
  if (!res.ok) {
    throw new Error(
      `Error obteniendo el saldo restante de la tarjeta: ${res.statusText}`,
    );
  }
  const json = await res.json();
  return json.data[0] ?? null;
}

// Crear un nuevo cliente con su tarjeta y saldo inicial
export async function crearClienteConTarjeta(
  cli_codigo: string,
  cli_nombre: string,
  cli_calle: string,
  cob_codigo: string,
  tar_valor: string,
  tar_cuota: string,
  tar_fecha: string,
  tar_iten: string,
  tar_tiempo: string,
  tar_fp: string,
): Promise<any> {
  const res = await fetch(`${API_URL}/abonopage/cliente/nuevo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
    }),
  });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "ERROR_DESCONOCIDO");
  }

  return json.data;
}

// Obtener todos los clientes del cobro
export async function getTodosClientes(cob_codigo: string): Promise<any[]> {
  const res = await fetch(`${API_URL}/abonopage/${cob_codigo}/clientes`);
  if (!res.ok) {
    throw new Error(`Error obteniendo los clientes: ${res.statusText}`);
  }
  const json = await res.json();
  return json.data;
}

// Creando la descripcion de los abonos
export async function crearDescripcionAbono(
  tar_codigo: string,
  fecha_act : string,
  des_fecha: string,
  des_abono: string,
  des_resta: string
): Promise<any> {
  const res = await fetch(`${API_URL}/abonopage/descripcion/crear`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tar_codigo,
      fecha_act,
      des_fecha,
      des_abono,
      des_resta
    }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "ERROR_DESCONOCIDO");
  }

  return json.data;
}