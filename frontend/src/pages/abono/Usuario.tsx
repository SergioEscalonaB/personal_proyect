import "bootstrap/dist/js/bootstrap.min.js";
import { useAbono } from "./AbonoContext";

function Selector() {
  const {
    rutas,
    cobroSeleccionado,
    setCobroSeleccionado,
    cliente,
    saldoRestante,
    cobroActivo
  } = useAbono();

  return (
    <div>
      {/* FILA 1 */}
      <div className="row">
        <div className="d-flex align-items-start gap-2 w-100">
          <div className="mb-2 fs-5 flex-shrink-0">Código del Cobro:</div>

          <div className="dropdown">
            <button
              className="btn btn-secondary btn-sm dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              disabled={cobroActivo}
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
                    disabled={cobroActivo}
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
          <div className="fs-5">Cédula:</div>
          <div className="fs-5 fw-bold">{cliente?.CLI_CODIGO ?? "-"}</div>

          <div className="fs-5">Nombre:</div>
          <div className="fs-5 fw-bold">{cliente?.CLI_NOMBRE ?? "-"}</div>

          <div className="fs-5">Dir - Tel:</div>
          <div className="fs-5 fw-bold">{cliente?.CLI_CALLE ?? "-"}</div>
          <div className="fs-5">Plazo:</div>
          <div className="fs-5 fw-bold">{cliente?.TIEMPO ?? "-"}</div>
          <div className="fs-5">Fp:</div>
          <div className="fs-5 fw-bold">{cliente?.FP ?? "-"}</div>
          <div className="fs-5">Utilidad:</div>
          <div className="fs-5 fw-bold">{cliente?.UTILIDAD}</div>
          <div className="fs-5">Prestamo:</div>
          <div className="fs-5 fw-bold">{cliente?.PRES}</div>
        </div>

        <div className="d-flex align-items-center gap-2 w-100 mt-2">
          <div className="fs-5">Valor:</div>
          <div className="fs-5 fw-bold">{cliente?.TAR_VALOR ?? "-"}</div>

          <div className="fs-5">Cuota:</div>
          <div className="fs-5 fw-bold">{cliente?.TAR_CUOTA ?? "-"}</div>

          <div className="fs-5">Fecha:</div>
          <div className="fs-5 fw-bold">{cliente?.TAR_FECHA ?? "-"}</div>

          <div className="fs-5">Codigo Tarjeta:</div>
          <div className="fs-5 fw-bold">{cliente?.TAR_CODIGO ?? "-"}</div>
          <div className="fs-5">Saldo restante:</div>
          <div className="fs-5 fw-bold">{saldoRestante?.DES_RESTA ?? cliente?.TAR_VALOR}</div>
        </div>
      </div>
    </div>
  );
}

export default Selector;
