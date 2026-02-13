import "bootstrap/dist/css/bootstrap.min.css";
import { useAbono } from "./AbonoContext";

function Liquidacion() {
  const {
    totalCobro,
    totalPrestamo,
    tarjetasCanceladas,
    tarjetasIngresadas,
    cobroActivo,
    utilidadCobro,
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
  } = useAbono();

  // Convertir a formato mostrado (dividir entre 1000)
  const formatearValor = (valor: number) => {
    return (valor / 1000).toFixed(0);
  };

  // Convertir input a valor real (multiplicar por 1000)
  const convertirAReal = (valor: string): number => {
    const num = parseFloat(valor) || 0;
    return num * 1000;
  };

  // Calcular la diferencia usando el total del contexto + el manual
  const calcularDiferencia = () => {
    const cobroTotal = totalCobro + cobroManual;
    const prestamoTotal = totalPrestamo + prestamoManual;

    // Lo que DEBE haber en efectivo
    const debeHaber =
      cobroTotal - prestamoTotal - gastos - otrosGastos + base - descuento;

    // Diferencia = lo que HAY - lo que DEBE haber
    return efectivo - debeHaber;
  };

  // Formatear diferencia con signo
  const formatearDiferencia = () => {
    const diff = calcularDiferencia();
    if (diff === 0) return "";

    const valorFormateado = formatearValor(Math.abs(diff));
    return diff < 0 ? `-${valorFormateado}` : valorFormateado;
  };

  // Obtener clase de color según el signo
  const getColorDiferencia = () => {
    const diff = calcularDiferencia();
    if (diff === 0) return "";
    return diff > 0 ? "text-success" : "text-danger";
  };

  // Obtener fecha de hoy
  const obtenerFechaHoy = () => {
    const hoy = new Date();
    return hoy.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Función para guardar reporte
  const guardarReporte = () => {
    // Aquí va la lógica para guardar el reporte
    console.log("Guardando reporte...");
  };

  return (
    <div className="h-100 d-flex flex-column" style={{ overflow: "hidden" }}>
      {/* FILA 1 */}
      <div className="row g-0 mb-1">
        <div className="col-3">
          <div className="d-flex-center border border-primary bg-primary-subtle rounded ">
            <div className="fs-6 fw-bold flex-shrink-0 text-center">
              Utilidad: {formatearValor(utilidadCobro)}
            </div>
          </div>
        </div>
      </div>

      {/* FILA 2 - COBRO */}
      <div className="row g-0 mb-1 align-items-center">
        <div className="col-2">
          <div className="small fw-bold">COBRO</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="fw-bold form-control form-control-sm"
            placeholder=""
            value={formatearValor(totalCobro + cobroManual)}
            onChange={(e) => {
              const nuevoTotal = convertirAReal(e.target.value);
              setCobroManual(nuevoTotal - totalCobro);
            }}
            disabled={!cobroActivo}
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>

      {/* FILA 3 - PRESTAMO */}
      <div className="row g-0 mb-1 align-items-center">
        <div className="col-2">
          <div className="small fw-bold">- PRESTAMO</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="fw-bold form-control form-control-sm"
            placeholder=""
            value={formatearValor(totalPrestamo + prestamoManual)}
            onChange={(e) => {
              const nuevoTotal = convertirAReal(e.target.value);
              setPrestamoManual(nuevoTotal - totalPrestamo);
            }}
            disabled={!cobroActivo}
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>

      {/* FILA 4 - GASTOS */}
      <div className="row g-0 mb-1 align-items-center position-relative">
        <div className="col-2">
          <div className="small fw-bold">- GASTOS</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="fw-bold form-control form-control-sm"
            placeholder=""
            value={gastos === 0 ? "" : formatearValor(gastos)}
            onChange={(e) => setGastos(convertirAReal(e.target.value))}
            disabled={!cobroActivo}
            style={{ fontSize: "0.85rem" }}
          />
        </div>
        <div className="col-2">
          <div className="small fw-bold text-center">Otr Gastos</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="fw-bold form-control form-control-sm"
            placeholder=""
            value={otrosGastos === 0 ? "" : formatearValor(otrosGastos)}
            onChange={(e) => setOtrosGastos(convertirAReal(e.target.value))}
            disabled={!cobroActivo}
            style={{ fontSize: "0.85rem" }}
          />
        </div>
        {/* COLUMNA LATERAL - REPORTE - 4 */}
        <div className="col-4 d-flex flex-column justify-content-center align-items-center position-absolute end-0">
          <div className="border border-secondary bg-light p-3 rounded mb-3 text-center" style={{ height: "100%" }}>
            <div className="fw-bold mb-2" style={{ fontSize: "1rem" }}>
              REPORTE
            </div>
            <div className="text-danger fw-bold mb-2" style={{ fontSize: "0.9rem" }}>
              No Guardado
            </div>
            <div className="text" style={{ fontSize: "0.85rem" }}>
              {obtenerFechaHoy()}
            </div>
            <button
            className=" mt-2 btn btn-primary w-60"
            onClick={guardarReporte}
            disabled={!cobroActivo}
          >
            Guardar
          </button>
          </div>
          
        </div>
      </div>
      {/* FILA 5 - BASE */}
      <div className="row g-0 mb-1 align-items-center">
        <div className="col-2">
          <div className="small fw-bold">+ BASE</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="fw-bold form-control form-control-sm"
            placeholder=""
            value={base === 0 ? "" : formatearValor(base)}
            onChange={(e) => setBase(convertirAReal(e.target.value))}
            disabled={!cobroActivo}
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>

      {/* FILA 6 - DESCUENTO */}
      <div className="row g-0 mb-1 align-items-center">
        <div className="col-2">
          <div className="small fw-bold">- DESCUENTO</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="fw-bold form-control form-control-sm"
            placeholder=""
            value={descuento === 0 ? "" : formatearValor(descuento)}
            onChange={(e) => setDescuento(convertirAReal(e.target.value))}
            disabled={!cobroActivo}
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>

      {/* FILA 7 - EFECTIVO Y DIFERENCIA */}
      <div className="row g-0 mb-1 align-items-center">
        <div className="col-2">
          <div className="small fw-bold">Efectivo</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="fw-bold form-control form-control-sm border border-primary bg-success-subtle"
            placeholder=""
            value={efectivo === 0 ? "" : formatearValor(efectivo)}
            onChange={(e) => setEfectivo(convertirAReal(e.target.value))}
            disabled={!cobroActivo}
            style={{ fontSize: "0.85rem" }}
          />
        </div>
        <div className="col-2">
          <div className="small fw-bold text-center">Diferencia</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className={`fw-bold form-control form-control-sm border border-primary bg-warning-subtle ${getColorDiferencia()}`}
            placeholder=""
            value={formatearDiferencia() || "0"}
            readOnly
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>
      {/* FILA 8 - TARJETAS CANCELADAS E INGRESADAS */}
      <div className="row g-1 mb-1 align-items-center mt-2">
        <div className="col-5">
          <div className="small fw-bold text-center">
            TARJETAS CANCELADAS ({tarjetasCanceladas.length})
          </div>
        </div>
        <div className="col-5">
          <div className="small fw-bold text-center">
            TARJETAS INGRESADAS ({tarjetasIngresadas.length})
          </div>
        </div>
      </div>

      {/* FILA 9 - DETALLE DE TARJETAS */}
      <div
        className="row g-2 mb-1 flex-grow-1"
        style={{ minHeight: 0, overflow: "hidden" }}
      >
        <div className="col-5 h-100">
          <div
            className="border border-danger bg-danger-subtle p-2 text-start h-100"
            style={{
              overflowY: "auto",
            }}
          >
            {tarjetasCanceladas.length === 0 ? (
              <div className="text-center text-muted">--</div>
            ) : (
              <ul className="list-unstyled mb-0" style={{ fontSize: "0.9rem" }}>
                {tarjetasCanceladas.map((tarjeta, index) => (
                  <li key={index} className="mb-1">
                    <strong>{tarjeta.nombre}</strong> → $
                    {formatearValor(tarjeta.saldoCancelado)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="col-5 h-100">
          <div
            className="border border-primary bg-primary-subtle p-2 text-start h-100"
            style={{
              overflowY: "auto",
            }}
          >
            {tarjetasIngresadas.length === 0 ? (
              <div className="text-center text-muted">--</div>
            ) : (
              <ul className="list-unstyled mb-0" style={{ fontSize: "0.9rem" }}>
                {tarjetasIngresadas.map((tarjeta, index) => (
                  <li key={index} className="mb-1">
                    <strong>{tarjeta.nombre}</strong> → $
                    {formatearValor(tarjeta.prestamo)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Liquidacion;
