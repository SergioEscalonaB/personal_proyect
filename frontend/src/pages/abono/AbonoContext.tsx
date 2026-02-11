// context/AbonoContext.tsx
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
} from "../../services/abonopag";
import type { Cobro } from "../../types/cobro";
import type { TarjetaConSaldo } from "../../types/tarjetaconsaldo";
import type { DescripcionTarjeta } from "../../types/descripciontarjeta";
import type { SaldoRestante } from "../../types/saldorestante";
import type { TarjetaIngresada } from "../../types/tarjetaingresada";
import type { TarjetaCancelada } from "../../types/tarjetacancelada";

type AbonoContextType = {
  rutas: Cobro[];
  cobroSeleccionado: Cobro | null;
  cliente: TarjetaConSaldo | null;
  offset: number;
  total: number;
  descripcion: DescripcionTarjeta[];
  saldoRestante: SaldoRestante | null;
  todosClientes: any[];
  tarjetasCanceladas: TarjetaCancelada[];
  tarjetasIngresadas: TarjetaIngresada[];
  registrarTarjetaCancelada: (nombre: string, saldoCancelado: number) => void;
  registrarTarjetaIngresada: (nombre: string, prestamo: number) => void;
  setCobroSeleccionado: (c: Cobro) => void;
  resetearListas: () => void;
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
  totalCobro: number;
  totalPrestamo: number;
  sumaCobro: (monto: number) => void;
  sumaPrestamo: (monto: number) => void;
  resetearTotales: () => void;
  cobroActivo: boolean;
  iniciarCobro: () => void;
  finalizarCobro: () => void;
  gastos: number;
  setGastos: (valor: number) => void;
  otrosGastos: number;
  setOtrosGastos: (valor: number) => void;
  base: number;
  setBase: (valor: number) => void;
  descuento: number;
  setDescuento: (valor: number) => void;
  efectivo: number;
  setEfectivo: (valor: number) => void;
  cobroManual: number;
  setCobroManual: (valor: number) => void;
  prestamoManual: number;
  setPrestamoManual: (valor: number) => void;
};

const AbonoContext = createContext<AbonoContextType | undefined>(undefined);

export function AbonoProvider({ children }: { children: React.ReactNode }) {
  // Obtener las rutas de cobro
  const [rutas, setRutas] = useState<Cobro[]>([]);
  useEffect(() => {
    getRutas().then(setRutas);
  }, []);

  // Estado para la navegacion de tarjetas (con persistencia) - debe ir antes del useEffect
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

  // Cobro seleccionado y carga de tarjetas (con persistencia)
  const [cobroSeleccionado, setCobroSeleccionadoState] = useState<Cobro | null>(
    () => {
      const stored = localStorage.getItem("cobroSeleccionado");
      return stored ? JSON.parse(stored) : null;
    },
  );
  
  // Ref para guardar el código del cobro anterior y detectar cambios reales
  const prevCobroCodigoRef = useRef<string | null>(null);
  
  useEffect(() => {
    if (cobroSeleccionado) {
      const cobroActualCodigo = cobroSeleccionado.COB_CODIGO;
      
      // Verificar si el cobro realmente cambió o es la carga inicial
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

  // Función para seleccionar un cobro y reiniciar el offset
  const setCobroSeleccionado = (c: Cobro) => {
    setOffset(0);
    setCobroSeleccionadoState(c);
    // Persistir el cobro seleccionado y resetear offset
    localStorage.setItem("cobroSeleccionado", JSON.stringify(c));
    localStorage.setItem("offset", "0");
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
        const [, cob_codigo] = msg.split("|");
        alert(
          `El cliente ya tiene una tarjeta activa en el cobro ${cob_codigo}.`,
        );
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
        cliente.TAR_CODIGO, //Esto es lo que se debe corregir
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
      // Recargar el conteo de los clientes activos con saldo y tarjeta
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

  // Estados para la liquidacion
  const [totalCobro, setTotalCobro] = useState<number>(() => {
    const stored = localStorage.getItem("totalCobro");
    return stored ? parseFloat(stored) : 0;
  });

  const [totalPrestamo, setTotalPrestamo] = useState<number>(() => {
    const stored = localStorage.getItem("totalPrestamo");
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

  const sumaCobro = (monto: number) => {
    setTotalCobro((prev) => prev + monto);
  };

  const sumaPrestamo = (monto: number) => {
    setTotalPrestamo((prev) => prev + monto);
  };

  // Función para resetear los totales (útil al cambiar de cobro)
  const resetearTotales = () => {
    setTotalCobro(0);
    setTotalPrestamo(0);
    setGastos(0);
    setOtrosGastos(0);
    setBase(0);
    setDescuento(0);
    setEfectivo(0);
    setCobroManual(0);
    setPrestamoManual(0);
  };

  // Estado para el registro de tarjetas ingresadas y canceladas en la liquidación
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

  // Función para registrar tarjeta cancelada
  const registrarTarjetaCancelada = (
    nombre: string,
    saldoCancelado: number,
  ) => {
    setTarjetasCanceladas((prev) => [...prev, { nombre, saldoCancelado }]);
  };

  // Función para registrar tarjeta ingresada
  const registrarTarjetaIngresada = (nombre: string, prestamo: number) => {
    setTarjetasIngresadas((prev) => [...prev, { nombre, prestamo }]);
  };

  // Función para resetear listas (al cambiar de cobro)
  const resetearListas = () => {
    setTarjetasCanceladas([]);
    setTarjetasIngresadas([]);
  };

  // Estado para controlar si el cobro esta activo
  const [cobroActivo, setCobroActivo] = useState<boolean>(() => {
    // Recuperar del localStorage al cargar el componente
    const stored = localStorage.getItem("cobroActivo");
    return stored === "true";
  });

  // Guardar en localStorage cada vez que cambie el estado
  useEffect(() => {
    localStorage.setItem("cobroActivo", cobroActivo.toString());
  }, [cobroActivo]);

  // Función para iniciar el cobro
  const iniciarCobro = () => {
    setCobroActivo(true);
  };

  const finalizarCobro = () => {
    //Resetear todo los totales y listas
    resetearTotales();
    resetearListas();
    setCobroActivo(false);

    // Limpiar el localStorage
    localStorage.removeItem("cobroActivo");
    localStorage.removeItem("totalCobro");
    localStorage.removeItem("totalPrestamo");
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

  // Persistir totales y listas en localStorage
  useEffect(() => {
    if (cobroActivo) {
      localStorage.setItem("totalCobro", totalCobro.toString());
      localStorage.setItem("totalPrestamo", totalPrestamo.toString());
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
        totalCobro,
        totalPrestamo,
        sumaCobro,
        sumaPrestamo,
        resetearTotales,
        tarjetasCanceladas,
        tarjetasIngresadas,
        registrarTarjetaCancelada,
        registrarTarjetaIngresada,
        resetearListas,
        cobroActivo,
        iniciarCobro,
        finalizarCobro,
        gastos,
        setGastos,
        otrosGastos,
        setOtrosGastos,
        base,
        setBase,
        descuento,
        setDescuento,
        efectivo,
        setEfectivo,
        cobroManual,
        setCobroManual,
        prestamoManual,
        setPrestamoManual,
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