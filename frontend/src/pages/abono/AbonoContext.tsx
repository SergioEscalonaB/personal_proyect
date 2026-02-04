// context/AbonoContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  getDescripcionTarjeta,
  getRutas,
  getTarjetasconSaldo,
  getTotalTarjetas,} from "../../services/abonopag";
import type { Cobro } from "../../types/cobro";
import type { TarjetaConSaldo } from "../../types/tarjetaconsaldo";
import type { DescripcionTarjeta } from "../../types/descripciontarjeta";

type AbonoContextType = {
  rutas: Cobro[];
  cobroSeleccionado: Cobro | null;
  cliente: TarjetaConSaldo | null;
  offset: number;
  descripcion: DescripcionTarjeta[];
  setCobroSeleccionado: (c: Cobro) => void;
  siguiente: () => void;
  anterior: () => void;
  primero: () => void;
  ultimo: () => void;
  ConteoTarjetas?: () => void;
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

  return (
    <AbonoContext.Provider
      value={{
        rutas,
        cobroSeleccionado,
        cliente,
        offset,
        setCobroSeleccionado,
        siguiente,
        anterior,
        primero,
        ultimo,
        descripcion,
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
