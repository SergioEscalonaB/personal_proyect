// context/AbonoContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  getDescripcionTarjeta,
  getRutas,
  getTarjetasconSaldo,
  getTotalTarjetas,
  getSaldoRestante,
  crearClienteConTarjeta,
  getTodosClientes,
  crearDescripcionAbono,
} from "../../services/abonopag";
import type { Cobro } from "../../types/cobro";
import type { TarjetaConSaldo } from "../../types/tarjetaconsaldo";
import type { DescripcionTarjeta } from "../../types/descripciontarjeta";
import type { SaldoRestante } from "../../types/saldorestante";

type AbonoContextType = {
  rutas: Cobro[];
  cobroSeleccionado: Cobro | null;
  cliente: TarjetaConSaldo | null;
  offset: number;
  total: number;
  descripcion: DescripcionTarjeta[];
  saldoRestante: SaldoRestante | null;
  todosClientes: any[];
  setCobroSeleccionado: (c: Cobro) => void;
  siguiente: () => void;
  anterior: () => void;
  primero: () => void;
  ultimo: () => void;
  crearNuevoCliente: (
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
  ) => void;
  ConteoTarjetas?: () => void;
  cargarTodosClientes: (cob_codigo: string) => void;
  crearNuevaDescripcion: (
    des_abono: string,
    des_resta: string,
  ) => Promise<void>;
};

const AbonoContext = createContext<AbonoContextType | null>(null);

export function AbonoProvider({ children }: { children: React.ReactNode }) {
  // Obtener las rutas de cobro
  const [rutas, setRutas] = useState<Cobro[]>([]);
  useEffect(() => {
    getRutas().then(setRutas);
  }, []);

  // Cobro seleccionado y carga de tarjetas
  const [cobroSeleccionado, setCobroSeleccionadoState] = useState<Cobro | null>(
    null,
  );
  useEffect(() => {
    if (cobroSeleccionado) {
      cargarTarjeta(cobroSeleccionado.COB_CODIGO, 0);
    }
  }, [cobroSeleccionado]);

  // Estado para la navegacion de tarjetas
  const [offset, setOffset] = useState(0);
  const [cliente, setCliente] = useState<TarjetaConSaldo | null>(null);
  const cargarTarjeta = async (codigo: string, nuevoOffset: number) => {
    const data = await getTarjetasconSaldo(codigo, nuevoOffset);
    if (data.length > 0) {
      setCliente(data[0]);
      setOffset(nuevoOffset);
    }
  };

  // Función para seleccionar un cobro y reiniciar el offset
  const setCobroSeleccionado = (c: Cobro) => {
    setOffset(0);
    setCobroSeleccionadoState(c);
  };

  //Conteo de todos los clientes activos con saldo y tarjeta
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const ConteoTarjetas = async () => {
      if (cobroSeleccionado) {
        const totalTarjetas = await getTotalTarjetas(
          cobroSeleccionado.COB_CODIGO,
        );
        setTotal(totalTarjetas);
      }
    };
    ConteoTarjetas();
  }, [cobroSeleccionado]);

  // Funciones de navegación
  const siguiente = () => {
    if (cobroSeleccionado) {
      cargarTarjeta(cobroSeleccionado.COB_CODIGO, offset + 1);
    }
  };

  const anterior = () => {
    if (offset > 0 && cobroSeleccionado) {
      cargarTarjeta(cobroSeleccionado.COB_CODIGO, offset - 1);
    }
  };

  const primero = () => {
    if (cobroSeleccionado) {
      cargarTarjeta(cobroSeleccionado.COB_CODIGO, 0);
    }
  };

  const ultimo = () => {
    if (cobroSeleccionado) {
      cargarTarjeta(cobroSeleccionado.COB_CODIGO, total - 1);
    }
  };

  // Mostrar descripcion de la tarjeta del cliente
  const [descripcion, setDescripcion] = useState<DescripcionTarjeta[]>([]);
  useEffect(() => {
    const cargarDescripcion = async () => {
      if (cliente?.TAR_CODIGO) {
        const desc = await getDescripcionTarjeta(cliente.TAR_CODIGO);
        setDescripcion(desc);
      } else {
        setDescripcion([]);
      }
    };
    cargarDescripcion();
  }, [cliente]);

  // Obtener saldo restante de la tarjeta
  const [saldoRestante, setSaldoRestante] = useState<SaldoRestante | null>(
    null,
  );
  useEffect(() => {
    const cargarSaldoRestante = async () => {
      if (cliente?.TAR_CODIGO) {
        const data = await getSaldoRestante(cliente.TAR_CODIGO);
        setSaldoRestante(data);
      } else {
        setSaldoRestante(null);
      }
    };

    cargarSaldoRestante();
  }, [cliente]);

  // Crear un nuevo cliente con su tarjeta y saldo inicial
  const crearNuevoCliente = async (
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
  ) => {
    try {
      await crearClienteConTarjeta(
        cli_codigo,
        cli_nombre,
        cli_calle,
        cobroSeleccionado ? cobroSeleccionado.COB_CODIGO : cob_codigo,
        tar_valor,
        tar_cuota,
        tar_fecha,
        tar_iten,
        tar_tiempo,
        tar_fp,
      );
      const contartarjetas = await getTotalTarjetas(
        cobroSeleccionado ? cobroSeleccionado.COB_CODIGO : cob_codigo,
      );
      setTotal(contartarjetas);

      //Darle tiempo al backend para procesar la creación del cliente y su tarjeta antes de recargar
      //await new Promise((resolve) => setTimeout(resolve, 500));
      // Recargar en la posicion del nuevo cliente
      if (cobroSeleccionado && cliente) {
        const itenActual = parseFloat(cliente.ITEN);
        const itenNuevo = parseFloat(tar_iten);

        // Si insertaste antes o en la misma posición, quedas en el mismo offset
        // Si insertaste después, avanzas 1
        const nuevaPosicion = itenNuevo <= itenActual ? offset : offset + 1;

        cargarTarjeta(cobroSeleccionado.COB_CODIGO, nuevaPosicion);
      }
    } catch (error: any) {
      const msg = error?.message ?? "";
      if (msg.startsWith("CLIENTE_YA_EXISTE")) {
        const[, cob_codigo] = msg.split("|");
        alert(`El cliente ya tiene una tarjeta activa en el cobro ${cob_codigo}.`);
        return;
      }
      throw error;
    }
  };

  //Cargar clientes existentes cuando se marque el checkbox
  const [todosClientes, setTodosClientes] = useState<any[]>([]);
  const cargarTodosClientes = async (cob_codigo: string) => {
    try {
      const data = await getTodosClientes(cob_codigo);
      setTodosClientes(data);
    } catch (error) {
      console.error("Error al cargar todos los clientes:", error);
      setTodosClientes([]);
    }
  };

  // Creando la descripcion de los abonos
  const crearNuevaDescripcion = async (
    des_abono: string,
    des_resta: string,
  ) => {
    if (!cliente?.TAR_CODIGO) {
      console.error("No hay cliente seleccionado");
      return;
    }
    try {
      // Generar fecha_act con formato: "07-feb-26->30000"
      const hoy = new Date();
      const dd = String(hoy.getDate()).padStart(2, "0");
      const meses = [
        "ene",
        "feb",
        "mar",
        "abr",
        "may",
        "jun",
        "jul",
        "ago",
        "sep",
        "oct",
        "nov",
        "dic",
      ];
      const mes = meses[hoy.getMonth()];
      const yy = String(hoy.getFullYear()).slice(-2);
      const fecha_act = `${dd}-${mes}-${yy}->${des_abono}`;

      // Generar des_fecha con formato: "DD-MM-YY"
      const mm = String(hoy.getMonth() + 1).padStart(2, "0");
      const des_fecha = `${dd}-${mm}-${yy}`;

      await crearDescripcionAbono(
        cliente.TAR_CODIGO,
        fecha_act,
        des_fecha,
        des_abono,
        des_resta,
      );

      // Recargar la descripcion y el saldo restante
      const desc = await getDescripcionTarjeta(cliente.TAR_CODIGO);
      setDescripcion(desc);
      // Recargar el saldo restante
      const saldo = await getSaldoRestante(cliente.TAR_CODIGO);
      setSaldoRestante(saldo);
    } catch (error) {
      console.error("Error al crear la descripción del abono:", error);
      throw error;
    }
  };

  return (
    <AbonoContext.Provider
      value={{
        rutas,
        cobroSeleccionado,
        cliente,
        offset,
        total,
        setCobroSeleccionado,
        siguiente,
        anterior,
        primero,
        ultimo,
        descripcion,
        saldoRestante,
        crearNuevoCliente,
        todosClientes,
        cargarTodosClientes,
        crearNuevaDescripcion,
      }}
    >
      {children}
    </AbonoContext.Provider>
  );
}

export const useAbono = () => {
  const ctx = useContext(AbonoContext);
  if (!ctx) throw new Error("useAbono debe usarse dentro de AbonoProvider");
  return ctx;
};
