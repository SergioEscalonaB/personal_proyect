import "bootstrap/dist/js/bootstrap.min.js";
import { useEffect, useState } from "react";
import type { Cobro } from "../../types/cobro";
import type { TarjetaConSaldo } from "../../types/tarjetaconsaldo";
import { getRutas, getTarjetasconSaldo } from "../../services/abonopag";

function Selector() {
  const [rutas, setRutas] = useState<Cobro[]>([]);
  const [cobroSeleccionado, setCobroSeleccionado] = useState<Cobro | null>(
    null,
  );
  const [offset, setOffset] = useState(0);
  const [cliente, setCliente] = useState<TarjetaConSaldo | null>(null);
  
  useEffect(() => {
    getRutas().then((data) => {
      setRutas(data);
    });
  }, []);

  // Cargar tarjetas cuando se selecciona un cobro
  useEffect(() => {
    if (cobroSeleccionado) {
      setOffset(0); // Resetear offset
      cargarTarjeta(cobroSeleccionado.COB_CODIGO, 0);
    }
  }, [cobroSeleccionado]);
  
  // Función para cargar una tarjeta específica
  const cargarTarjeta = async (cobroCodigo: string, nuevoOffset: number) => {
    try {
      const data = await getTarjetasconSaldo(cobroCodigo, nuevoOffset);
      if (data.length > 0) {
        // CAMBIO AQUÍ: setCliente en lugar de setCliente
        setCliente(data[0]);
        setOffset(nuevoOffset);
      } else {
        setCliente(null);
      }
    } catch (error) {
      console.error("Error cargando tarjeta:", error);
    }
  };

  // Funciones para navegar entre tarjetas
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

  return (
    <div>
      {/* FILA 1 */}
      <div className="row">
        <div className="d-flex align-items-start gap-2 w-100">
          <div className="mb-2 fs-5 flex-shrink-0">Codigo del Cobro:</div>
          <div className="dropdown">
            <button
              className="btn btn-secondary btn-sm dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {cobroSeleccionado
                ? cobroSeleccionado.COB_CODIGO
                : "Seleccione un cobro"}
            </button>

            <ul className="dropdown-menu">
              {rutas.map((ruta) => (
                <li key={ruta.COB_CODIGO}>
                  <button
                    className="dropdown-item"
                    onClick={() => setCobroSeleccionado(ruta)}
                  >
                    {ruta.COB_CODIGO}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* FILA 2 */}
      <div className="row">
        <div className="d-flex align-items-center gap-2 w-100">
          <div className="mb-2 fs-5 flex-shrink-0">Cedula:</div>
          <div className="mb-2 fs-5 fw-bold">
            {/* CAMBIO AQUÍ: cliente en lugar de cliente */}
            {cliente ? cliente.CLI_CODIGO : "-"}
          </div>

          {/* Botones de navegación */}
          {cobroSeleccionado && (
            <div className="ms-auto d-flex gap-2">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={anterior}
                disabled={offset === 0}
              >
                ← Anterior
              </button>
              <span className="align-self-center">Tarjeta {offset + 1}</span>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={siguiente}
                disabled={!cliente}
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FILA 3 - Información adicional de la tarjeta */}
      {cliente && (
        <div className="row mt-3">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Información del Cliente</h6>
                <p className="mb-1">
                  <strong>Nombre:</strong> {cliente.CLI_NOMBRE}
                </p>
                <p className="mb-1">
                  <strong>Calle:</strong> {cliente.CLI_CALLE}
                </p>
                <p className="mb-1">
                  <strong>Saldo:</strong> ${cliente.TAR_VALOR}
                </p>
                <p className="mb-1">
                  <strong>Cuota:</strong> ${cliente.TAR_CUOTA}
                </p>
                <p className="mb-1">
                  <strong>Fecha:</strong> {cliente.TAR_FECHA}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Selector;