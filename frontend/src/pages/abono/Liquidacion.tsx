import "bootstrap/dist/css/bootstrap.min.css";
import { useAbono } from "./AbonoContext";

function Liquidacion() {
  const { totalCobro, totalPrestamo } = useAbono();

  // Convertir a formato mostrado (dividir entre 1000)
  const formatearValor = (valor: number) => {
    return (valor / 1000).toFixed(0);
  };



  return (
    <div>
      {/* FILA 1 */}
      <div className="row g-0 mb-1">
        <div className="col-3">
          <div className="d-flex-center border border-primary bg-warning rounded ">
            <div className="fs-6 flex-shrink-0">--</div>
          </div>
        </div>
      </div>
      {/* FILA 2 */}
      <div className="row g-0 mb-1 align-items-center">
        <div className="col-3">
          <div className="fs-6 fw-bold">COBRO</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="form-control form-control-sm"
            value={formatearValor(totalCobro)}
            placeholder=""
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>
      {/* FILA 3 */}
      <div className="row g-0 mb-1 align-items-center">
        <div className="col-3">
          <div className="fs-6 fw-bold">- PRESTAMO</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="form-control form-control-sm"
            value={formatearValor(totalPrestamo)}
            placeholder=""
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>
      {/* FILA 4 */}
      <div className="row g-0 mb-1 align-items-center">
        <div className="col-3">
          <div className="fs-6 fw-bold">- GASTOS</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder=""
            style={{ fontSize: "0.85rem" }}
          />
        </div>
        <div className="col-2">
          <div className="fs-6 fw-bold">Otr Gastos</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder=""
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>
      {/* FILA 5 */}
      <div className="row g-0 mb-1 align-items-center">
        <div className="col-3">
          <div className="fs-6 fw-bold">+ BASE</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder=""
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>
      {/* FILA 6 */}
      <div className="row g-0 mb-1 align-items-center">
        <div className="col-3">
          <div className="fs-6 fw-bold">- DESCUENTO</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder=""
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>
      {/* FILA 7 */}
      <div className="row g-0 mb-1 align-items-center">
        <div className="col-3">
          <div className="fs-6 fw-bold">Efectivo</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="form-control form-control-sm border border-primary bg-success-subtle"
            placeholder=""
            style={{ fontSize: "0.85rem" }}
          />
        </div>
        <div className="col-2">
          <div className="fs-6 fw-bold">Diferencia</div>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="form-control form-control-sm border border-primary bg-warning-subtle"
            placeholder=""
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>
    </div>
  );
}

export default Liquidacion;
