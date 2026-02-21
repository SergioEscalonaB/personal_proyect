import { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  getDescripcionTarjeta,
  getRutas,
  getTarjetasconSaldo,
  getTotalTarjetas,
  getSaldoRestante,
  crearClienteConTarjeta,
  getTodosClientes,
  crearDescripcionAbono,
  buscarClientesPorNombre,
} from "../../services/abonopag";
import type { Cobro } from "../../types/cobro";
import type { TarjetaConSaldo } from "../../types/tarjetaconsaldo";
import type { DescripcionTarjeta } from "../../types/descripciontarjeta";
import type { SaldoRestante } from "../../types/saldorestante";
import type { TarjetaIngresada } from "../../types/tarjetaingresada";
import type { TarjetaCancelada } from "../../types/tarjetacancelada";

// ─── TIPO DEL CONTEXTO ────────────────────────────────────────────────────────

type AbonoContextType = {
  // Rutas
  rutas: Cobro[];

  // Navegación
  cobroSeleccionado: Cobro | null;
  cliente: TarjetaConSaldo | null;
  offset: number;
  total: number;
  setCobroSeleccionado: (c: Cobro) => void;
  siguiente: () => void;
  anterior: () => void;
  primero: () => void;
  ultimo: () => void;
  busqueda: (offset: number) => void;

  // Datos de la tarjeta
  descripcion: DescripcionTarjeta[];
  saldoRestante: SaldoRestante | null;

  // Gestión de clientes
  todosClientes: any[];
  ConteoTarjetas?: () => void;
  cargarTodosClientes: (cob_codigo: string) => void;
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
    tar_pres: string,
    tar_utilidad: string,
  ) => void;
  crearNuevaDescripcion: (
    des_abono: string,
    des_resta: string,
  ) => Promise<void>;

  // Liquidación
  totalCobro: number;
  totalPrestamo: number;
  utilidadCobro: number;
  gastos: number;
  otrosGastos: number;
  base: number;
  descuento: number;
  efectivo: number;
  cobroManual: number;
  prestamoManual: number;
  reporteGuardado: boolean;
  sumaCobro: (monto: number) => void;
  sumaPrestamo: (monto: number) => void;
  sumaUtilidadCobro: (monto: number) => void;
  resetearTotales: () => void;
  setGastos: (valor: number) => void;
  setOtrosGastos: (valor: number) => void;
  setBase: (valor: number) => void;
  setDescuento: (valor: number) => void;
  setEfectivo: (valor: number) => void;
  setCobroManual: (valor: number) => void;
  setPrestamoManual: (valor: number) => void;
  setReporteGuardado: (valor: boolean) => void;

  // Listas de tarjetas
  tarjetasCanceladas: TarjetaCancelada[];
  tarjetasIngresadas: TarjetaIngresada[];
  registrarTarjetaCancelada: (nombre: string, saldoCancelado: number) => void;
  registrarTarjetaIngresada: (nombre: string, prestamo: number) => void;
  resetearListas: () => void;

  // Control del cobro
  cobroActivo: boolean;
  iniciarCobro: () => void;
  finalizarCobro: () => void;

  // Listas de clientes
  listaClientes: any[];
  buscarClientes: () => void;
};

// ─── CONTEXTO ─────────────────────────────────────────────────────────────────

const AbonoContext = createContext<AbonoContextType | undefined>(undefined);

// ─── PROVIDER ─────────────────────────────────────────────────────────────────

export function AbonoProvider({ children }: { children: React.ReactNode }) {
  // ── 1. RUTAS DE COBRO ──────────────────────────────────────────────────────

  const [rutas, setRutas] = useState<Cobro[]>([]);
  useEffect(() => {
    getRutas().then(setRutas);
  }, []);

  // ── 2. NAVEGACIÓN DE TARJETAS ──────────────────────────────────────────────

  const [offset, setOffset] = useState(() => {
    const stored = localStorage.getItem("offset");
    return stored ? parseInt(stored, 10) : 0;
  });

  const [cliente, setCliente] = useState<TarjetaConSaldo | null>(null);

  const cargarTarjeta = async (codigo: string, nuevoOffset: number) => {
    const data = await getTarjetasconSaldo(codigo, nuevoOffset);
    if (data.length > 0) {
      setCliente(data[0]);
      setOffset(nuevoOffset);
      // Persistir el offset actual
      localStorage.setItem("offset", nuevoOffset.toString());
    }
  };

  // Cobro seleccionado (con persistencia)
  const [cobroSeleccionado, setCobroSeleccionadoState] = useState<Cobro | null>(
    () => {
      const stored = localStorage.getItem("cobroSeleccionado");
      return stored ? JSON.parse(stored) : null;
    },
  );

  // Ref para detectar cambios reales de cobro vs. carga inicial
  const prevCobroCodigoRef = useRef<string | null>(null);

  useEffect(() => {
    if (cobroSeleccionado) {
      const cobroActualCodigo = cobroSeleccionado.COB_CODIGO;

      if (prevCobroCodigoRef.current === null) {
        // Carga inicial: usar el offset restaurado de localStorage
        const storedOffset = localStorage.getItem("offset");
        const initialOffset = storedOffset ? parseInt(storedOffset, 10) : 0;
        cargarTarjeta(cobroActualCodigo, initialOffset);
      } else if (prevCobroCodigoRef.current !== cobroActualCodigo) {
        // El cobro cambió: empezar desde 0
        cargarTarjeta(cobroActualCodigo, 0);
      }

      prevCobroCodigoRef.current = cobroActualCodigo;
    }
  }, [cobroSeleccionado]);

  const setCobroSeleccionado = (c: Cobro) => {
    setOffset(0);
    setCobroSeleccionadoState(c);
    // Persistir el cobro seleccionado y resetear offset
    localStorage.setItem("cobroSeleccionado", JSON.stringify(c));
    localStorage.setItem("offset", "0");
  };

  // Conteo de todos los clientes activos con saldo y tarjeta
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
    if (cobroSeleccionado)
      cargarTarjeta(cobroSeleccionado.COB_CODIGO, offset + 1);
  };

  const anterior = () => {
    if (offset > 0 && cobroSeleccionado)
      cargarTarjeta(cobroSeleccionado.COB_CODIGO, offset - 1);
  };

  const primero = () => {
    if (cobroSeleccionado) cargarTarjeta(cobroSeleccionado.COB_CODIGO, 0);
  };

  const ultimo = () => {
    if (cobroSeleccionado)
      cargarTarjeta(cobroSeleccionado.COB_CODIGO, total - 1);
  };

  const busqueda = (nuevoOffset: number) => {
    if (cobroSeleccionado) cargarTarjeta(cobroSeleccionado.COB_CODIGO, nuevoOffset);
  };

  // ── 3. DATOS DE LA TARJETA ─────────────────────────────────────────────────

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

  // ── 4. GESTIÓN DE CLIENTES ─────────────────────────────────────────────────

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
    tar_pres: string,
    tar_utilidad: string,
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
        tar_pres,
        tar_utilidad,
      );
      const contartarjetas = await getTotalTarjetas(
        cobroSeleccionado ? cobroSeleccionado.COB_CODIGO : cob_codigo,
      );
      setTotal(contartarjetas);

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
        const [, cob_codigo] = msg.split("|");
        alert(
          `El cliente ya tiene una tarjeta activa en el cobro ${cob_codigo}.`,
        );
        return;
      }
      throw error;
    }
  };

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
        cliente.TAR_CODIGO, //Esto es lo que se debe corregir
        fecha_act,
        des_fecha,
        des_abono,
        des_resta,
      );

      // Recargar descripcion, saldo restante y conteo
      const desc = await getDescripcionTarjeta(cliente.TAR_CODIGO);
      setDescripcion(desc);

      const saldo = await getSaldoRestante(cliente.TAR_CODIGO);
      setSaldoRestante(saldo);

      if (cobroSeleccionado) {
        const totalTarjetas = await getTotalTarjetas(
          cobroSeleccionado.COB_CODIGO,
        );
        setTotal(totalTarjetas);
      }
    } catch (error) {
      console.error("Error al crear la descripción del abono:", error);
      throw error;
    }
  };

  // ── 5. LIQUIDACIÓN ─────────────────────────────────────────────────────────

  const [totalCobro, setTotalCobro] = useState<number>(() => {
    const stored = localStorage.getItem("totalCobro");
    return stored ? parseFloat(stored) : 0;
  });

  const [totalPrestamo, setTotalPrestamo] = useState<number>(() => {
    const stored = localStorage.getItem("totalPrestamo");
    return stored ? parseFloat(stored) : 0;
  });

  const [utilidadCobro, setUtilidadCobro] = useState<number>(() => {
    const stored = localStorage.getItem("utilidadCobro");
    return stored ? parseFloat(stored) : 0;
  });

  const [gastos, setGastos] = useState<number>(() => {
    const stored = localStorage.getItem("gastos");
    return stored ? parseFloat(stored) : 0;
  });

  const [otrosGastos, setOtrosGastos] = useState<number>(() => {
    const stored = localStorage.getItem("otrosGastos");
    return stored ? parseFloat(stored) : 0;
  });

  const [base, setBase] = useState<number>(() => {
    const stored = localStorage.getItem("base");
    return stored ? parseFloat(stored) : 0;
  });

  const [descuento, setDescuento] = useState<number>(() => {
    const stored = localStorage.getItem("descuento");
    return stored ? parseFloat(stored) : 0;
  });

  const [efectivo, setEfectivo] = useState<number>(() => {
    const stored = localStorage.getItem("efectivo");
    return stored ? parseFloat(stored) : 0;
  });

  const [cobroManual, setCobroManual] = useState<number>(() => {
    const stored = localStorage.getItem("cobroManual");
    return stored ? parseFloat(stored) : 0;
  });

  const [prestamoManual, setPrestamoManual] = useState<number>(() => {
    const stored = localStorage.getItem("prestamoManual");
    return stored ? parseFloat(stored) : 0;
  });

  const [reporteGuardado, setReporteGuardado] = useState(false);

  const sumaCobro = (monto: number) => setTotalCobro((prev) => prev + monto);
  const sumaPrestamo = (monto: number) =>
    setTotalPrestamo((prev) => prev + monto);
  const sumaUtilidadCobro = (monto: number) =>
    setUtilidadCobro((prev) => prev + monto);

  const resetearTotales = () => {
    setTotalCobro(0);
    setTotalPrestamo(0);
    setUtilidadCobro(0);
    setGastos(0);
    setOtrosGastos(0);
    setBase(0);
    setDescuento(0);
    setEfectivo(0);
    setCobroManual(0);
    setPrestamoManual(0);
    setReporteGuardado(false);
  };

  // ── 6. LISTAS DE TARJETAS ──────────────────────────────────────────────────

  const [tarjetasCanceladas, setTarjetasCanceladas] = useState<
    TarjetaCancelada[]
  >(() => {
    const stored = localStorage.getItem("tarjetasCanceladas");
    return stored ? JSON.parse(stored) : [];
  });

  const [tarjetasIngresadas, setTarjetasIngresadas] = useState<
    TarjetaIngresada[]
  >(() => {
    const stored = localStorage.getItem("tarjetasIngresadas");
    return stored ? JSON.parse(stored) : [];
  });

  const registrarTarjetaCancelada = (
    nombre: string,
    saldoCancelado: number,
  ) => {
    setTarjetasCanceladas((prev) => [...prev, { nombre, saldoCancelado }]);
  };

  const registrarTarjetaIngresada = (nombre: string, prestamo: number) => {
    setTarjetasIngresadas((prev) => [...prev, { nombre, prestamo }]);
  };

  const resetearListas = () => {
    setTarjetasCanceladas([]);
    setTarjetasIngresadas([]);
  };
  // ── 6. LISTAS DE CLIENTES ──────────────────────────────────────────────────
  const [listaClientes, setListaClientes] = useState<any[]>([]);
  
  const buscarClientes = async () => {
    if (!cobroSeleccionado) return;
    try {
      const data = await buscarClientesPorNombre(cobroSeleccionado.COB_CODIGO);
      setListaClientes(data);
    } catch (error) {
      console.error("Error al buscar clientes:", error);
    }
  };

  useEffect(() => {
    buscarClientes();
  }, [cobroSeleccionado]);

  // ── 7. CONTROL DEL COBRO ───────────────────────────────────────────────────

  const [cobroActivo, setCobroActivo] = useState<boolean>(() => {
    const stored = localStorage.getItem("cobroActivo");
    return stored === "true";
  });

  // Persistir cobroActivo en localStorage
  useEffect(() => {
    localStorage.setItem("cobroActivo", cobroActivo.toString());
  }, [cobroActivo]);

  const iniciarCobro = () => setCobroActivo(true);

  const finalizarCobro = () => {
    resetearTotales();
    resetearListas();
    setCobroActivo(false);

    // Limpiar el localStorage
    localStorage.removeItem("cobroActivo");
    localStorage.removeItem("totalCobro");
    localStorage.removeItem("totalPrestamo");
    localStorage.removeItem("utilidadCobro");
    localStorage.removeItem("gastos");
    localStorage.removeItem("otrosGastos");
    localStorage.removeItem("base");
    localStorage.removeItem("descuento");
    localStorage.removeItem("efectivo");
    localStorage.removeItem("cobroManual");
    localStorage.removeItem("prestamoManual");
    localStorage.removeItem("tarjetasCanceladas");
    localStorage.removeItem("tarjetasIngresadas");
    localStorage.removeItem("cobroSeleccionado");
    localStorage.removeItem("offset");
  };

  // ── 8. PERSISTENCIA EN localStorage ───────────────────────────────────────

  useEffect(() => {
    if (cobroActivo) {
      localStorage.setItem("totalCobro", totalCobro.toString());
      localStorage.setItem("totalPrestamo", totalPrestamo.toString());
      localStorage.setItem("utilidadCobro", utilidadCobro.toString());
      localStorage.setItem("gastos", gastos.toString());
      localStorage.setItem("otrosGastos", otrosGastos.toString());
      localStorage.setItem("base", base.toString());
      localStorage.setItem("descuento", descuento.toString());
      localStorage.setItem("efectivo", efectivo.toString());
      localStorage.setItem("cobroManual", cobroManual.toString());
      localStorage.setItem("prestamoManual", prestamoManual.toString());
      localStorage.setItem(
        "tarjetasCanceladas",
        JSON.stringify(tarjetasCanceladas),
      );
      localStorage.setItem(
        "tarjetasIngresadas",
        JSON.stringify(tarjetasIngresadas),
      );
    }
  }, [
    cobroActivo,
    totalCobro,
    totalPrestamo,
    utilidadCobro,
    gastos,
    otrosGastos,
    base,
    descuento,
    efectivo,
    cobroManual,
    prestamoManual,
    tarjetasCanceladas,
    tarjetasIngresadas,
  ]);

  // ── 9. RETURN DEL PROVIDER ─────────────────────────────────────────────────

  return (
    <AbonoContext.Provider
      value={{
        // Rutas
        rutas,
        // Navegación
        cobroSeleccionado,
        cliente,
        offset,
        total,
        setCobroSeleccionado,
        siguiente,
        anterior,
        primero,
        ultimo,
        busqueda,
        // Datos de la tarjeta
        descripcion,
        saldoRestante,
        // Gestión de clientes
        todosClientes,
        cargarTodosClientes,
        crearNuevoCliente,
        crearNuevaDescripcion,
        // Liquidación
        totalCobro,
        totalPrestamo,
        utilidadCobro,
        gastos,
        otrosGastos,
        base,
        descuento,
        efectivo,
        cobroManual,
        prestamoManual,
        reporteGuardado,
        sumaCobro,
        sumaPrestamo,
        sumaUtilidadCobro,
        resetearTotales,
        setGastos,
        setOtrosGastos,
        setBase,
        setDescuento,
        setEfectivo,
        setCobroManual,
        setPrestamoManual,
        setReporteGuardado,
        // Listas de tarjetas
        tarjetasCanceladas,
        tarjetasIngresadas,
        registrarTarjetaCancelada,
        registrarTarjetaIngresada,
        resetearListas,
        // Control del cobro
        cobroActivo,
        iniciarCobro,
        finalizarCobro,
        // Listas de clientes
        listaClientes,
        buscarClientes,
      }}
    >
      {children}
    </AbonoContext.Provider>
  );
}

// ─── HOOK ──────────────────────────────────────────────────────────────────────

export const useAbono = () => {
  const ctx = useContext(AbonoContext);
  if (!ctx) throw new Error("useAbono debe usarse dentro de AbonoProvider");
  return ctx;
};
