import "bootstrap/dist/css/bootstrap.min.css";
import { useAbono } from "./AbonoContext";
import { useState } from "react";

function Liquidacion() {
  const { totalCobro, totalPrestamo, tarjetasCanceladas, tarjetasIngresadas } =
    useAbono();

  const [gastos, setGastos] = useState(0);
  const [otrosGastos, setOtrosGastos] = useState(0);
  const [base, setBase] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [efectivo, setEfectivo] = useState(0);

  // Estados locales para cobro y prestamo editables
  const [cobroManual, setCobroManual] = useState(0);
  const [prestamoManual, setPrestamoManual] = useState(0);

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

  return (
    <div className="h-100 d-flex flex-column" style={{ overflow: "hidden" }}>
      {/* FILA 1 */}
      <div className="row g-0 mb-1">
        <div className="col-3">
          <div className="d-flex-center border border-primary bg-warning rounded ">
            <div className="fs-6 flex-shrink-0">--</div>
          </div>
        </div>
      </div>

      {/* FILA 2 - COBRO */}
      <div className="row g-0 mb-1 align-items-center">
        <div className="col-3">
          <div className="fs-6 fw-bold">COBRO</div>
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
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>

      {/* FILA 3 - PRESTAMO */}
      <div className="row g-0 mb-1 align-items-center">
        <div className="col-3">
          <div className="fs-6 fw-bold">- PRESTAMO</div>
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
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>

      {/* FILA 4 - GASTOS */}
      <div className="row g-0 mb-1 align-items-center">
        <div className="col-3">
          <div className="fs-6 fw-bold">- GASTOS</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="fw-bold form-control form-control-sm"
            placeholder=""
            value={gastos === 0 ? "" : formatearValor(gastos)}
            onChange={(e) => setGastos(convertirAReal(e.target.value))}
            style={{ fontSize: "0.85rem" }}
          />
        </div>
        <div className="col-2">
          <div className="fs-6 fw-bold text-center">Otr Gastos</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="fw-bold form-control form-control-sm"
            placeholder=""
            value={otrosGastos === 0 ? "" : formatearValor(otrosGastos)}
            onChange={(e) => setOtrosGastos(convertirAReal(e.target.value))}
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>

      {/* FILA 5 - BASE */}
      <div className="row g-0 mb-1 align-items-center">
        <div className="col-3">
          <div className="fs-6 fw-bold">+ BASE</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="fw-bold form-control form-control-sm"
            placeholder=""
            value={base === 0 ? "" : formatearValor(base)}
            onChange={(e) => setBase(convertirAReal(e.target.value))}
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>

      {/* FILA 6 - DESCUENTO */}
      <div className="row g-0 mb-1 align-items-center">
        <div className="col-3">
          <div className="fs-6 fw-bold">- DESCUENTO</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="fw-bold form-control form-control-sm"
            placeholder=""
            value={descuento === 0 ? "" : formatearValor(descuento)}
            onChange={(e) => setDescuento(convertirAReal(e.target.value))}
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>

      {/* FILA 7 - EFECTIVO Y DIFERENCIA */}
      <div className="row g-0 mb-1 align-items-center">
        <div className="col-3">
          <div className="fs-6 fw-bold">Efectivo</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="fw-bold form-control form-control-sm border border-primary bg-success-subtle"
            placeholder=""
            value={efectivo === 0 ? "" : formatearValor(efectivo)}
            onChange={(e) => setEfectivo(convertirAReal(e.target.value))}
            style={{ fontSize: "0.85rem" }}
          />
        </div>
        <div className="col-2">
          <div className="fs-6 fw-bold text-center">Diferencia</div>
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
      <div className="row g-1 mb-1 align-items-center mt-4">
        <div className="col-4">
          <div className="fs-6 fw-bold text-start">
            TARJETAS CANCELADAS ({tarjetasCanceladas.length})
          </div>
        </div>
        <div className="col-4">
          <div className="fs-6 fw-bold text-end">
            TARJETAS INGRESADAS ({tarjetasIngresadas.length})
          </div>
        </div>
      </div>

      {/* FILA 9 - DETALLE DE TARJETAS */}
      <div
        className="row g-2 mb-1 flex-grow-1"
        style={{ minHeight: 0, overflow: "hidden" }}
      >
        <div className="col-4 h-100">
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

        <div className="col-4 h-100">
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
