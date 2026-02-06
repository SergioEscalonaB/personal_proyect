import { useState } from "react";
import { useAbono } from "./AbonoContext";

function Botones() {
  const {
    offset,
    cliente,
    anterior,
    siguiente,
    primero,
    ultimo,
    cobroSeleccionado,
    crearNuevoCliente,
  } = useAbono();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    cli_codigo: "",
    cli_nombre: "",
    cli_calle: "",
    tar_valor: "",
    valor_prestamo: "",
    tar_cuota: "",
    tar_fecha: "",
    tar_iten: "",
    tar_tiempo: "",
    tar_fp: "D",
  });

  // Calcular cuota automáticamente al cambiar valor del préstamo
  // tiempo o frecuencia de pago
  const calcularCuota = (valor: string, tiempo: string, fp: string) => {
    const valorNum = parseFloat(valor) || 0;
    const tiempoNum = parseFloat(tiempo) || 1;

    const diasPorPeriodo: { [key: string]: number } = {
      D: 1,
      S: 7,
      Q: 15,
      M: 30,
    };

    const dias = diasPorPeriodo[fp] || 1;
    const numeroCuotas = Math.ceil(tiempoNum / dias);
    const cuota = numeroCuotas > 0 ? Math.round(valorNum / numeroCuotas) : 0;
    return cuota.toString();
  };

  // Manejadores que actualizan cuota automáticamente al cambiar tiempo o frecuencia de pago
  const handleTiempoChange = (tiempo: string) => {
    const cuota = calcularCuota(formData.tar_valor, tiempo, formData.tar_fp);
    setFormData({ ...formData, tar_tiempo: tiempo, tar_cuota: cuota });
  };

  const handleFpChange = (fp: string) => {
    const cuota = calcularCuota(formData.tar_valor, formData.tar_tiempo, fp);
    setFormData({ ...formData, tar_fp: fp, tar_cuota: cuota });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cobroSeleccionado) return;
    crearNuevoCliente(
      formData.cli_codigo,
      formData.cli_nombre,
      formData.cli_calle,
      cobroSeleccionado.COB_CODIGO,
      formData.tar_valor,
      formData.tar_cuota,
      formData.tar_fecha,
      formData.tar_iten,
      formData.tar_tiempo,
      formData.tar_fp,
    );
    setShowModal(false);
    setFormData({
      cli_codigo: "",
      cli_nombre: "",
      cli_calle: "",
      tar_valor: "",
      valor_prestamo: "",
      tar_cuota: "",
      tar_fecha: "",
      tar_iten: "",
      tar_tiempo: "",
      tar_fp: "",
    });
  };

  if (!cobroSeleccionado) return null;

  return (
    <>
      {/* FILA 1 */}
      <div className="d-flex gap-3 justify-content-center align-items-center mt-3">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setShowModal(true)}
        >
          Nuevo Cliente
        </button>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={primero}
          disabled={true}
        >
          Modificar
        </button>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={primero}
          disabled={true}
        >
          Abono
        </button>
      </div>

      {/* FILA 2 */}
      <div className="d-flex gap-3 justify-content-center align-items-center mt-3">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={primero}
          disabled={!cliente}
        >
          Primero
        </button>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={anterior}
          disabled={offset === 0}
        >
          ← Anterior
        </button>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={siguiente}
          disabled={!cliente}
        >
          Siguiente →
        </button>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={ultimo}
          disabled={!cliente}
        >
          Ultimo
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nuevo Cliente</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* FILA 1 */}
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.cli_nombre}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cli_nombre: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  {/* FILA 2 */}
                  <div className="row">
                    <div className="col-5">
                      <div className="mb-3">
                        <label className="form-label">Cédula del Cliente</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.cli_codigo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cli_codigo: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-7">
                      <div className="mb-3">
                        <label className="form-label">Teléfono/Direccion</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.cli_calle}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cli_calle: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  {/* FILA 3 */}
                  <div className="row">
                    <div className="col-6">
                      <div className="mb-3">
                        <label className="form-label">Préstamo Efectivo</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.valor_prestamo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              valor_prestamo: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="mb-3">
                        <label className="form-label">Valor Tarjeta</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.tar_valor}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tar_valor: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                  {/* FILA 4 */}
                  <div className="row">
                    <div className="col-6">
                      <div className="mb-3">
                        <label className="form-label">Tiempo (dias)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.tar_tiempo}
                          onChange={(e) => handleTiempoChange(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="mb-3">
                        <label className="form-label">Frecuencia de Pago</label>
                        <select
                          className="form-select"
                          value={formData.tar_fp}
                          onChange={(e) => handleFpChange(e.target.value)}
                          required
                        >
                          <option value="D">Diario</option>
                          <option value="S">Semanal</option>
                          <option value="Q">Quincenal</option>
                          <option value="M">Mensual</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* FILA 5 */}
                  <div className="row">
                    <div className="col-6">
                      <div className="mb-3">
                        <label className="form-label">Cuota Calculada</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.tar_cuota}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="mb-3">
                        <label className="form-label">Fecha (DD-MM-YY)</label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="DD-MM-YY"
                            value={formData.tar_fecha}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                tar_fecha: e.target.value,
                              })
                            }
                            required
                          />
                          <div className="input-group-text">
                            <input
                              className="form-check-input mt-0"
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  const hoy = new Date();
                                  const dd = String(hoy.getDate()).padStart(
                                    2,
                                    "0",
                                  );
                                  const mm = String(
                                    hoy.getMonth() + 1,
                                  ).padStart(2, "0");
                                  const yy = String(hoy.getFullYear()).slice(
                                    -2,
                                  );
                                  setFormData({
                                    ...formData,
                                    tar_fecha: `${dd}-${mm}-${yy}`,
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    tar_fecha: "",
                                  });
                                }
                              }}
                            />
                            <label className="form-check-label ms-1">Hoy</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* FILA 6 */}
                  <div className="mb-3">
                    <label className="form-label">
                      Posición: {formData.tar_iten || "-"}{" "}
                      {/* ITEN Quitar eso al final */}
                    </label>
                    <div className="d-flex justify-content-center align-items-center gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="posicion"
                          id="antes"
                          checked={formData.tar_iten === cliente?.ITEN}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              tar_iten: cliente?.ITEN || "",
                            })
                          }
                          required
                        />
                        <label className="form-check-label" htmlFor="antes">
                          Antes
                        </label>
                      </div>
                      <span className="fw-bold">
                        {cliente?.CLI_NOMBRE || "Sin cliente"}
                      </span>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="posicion"
                          id="despues"
                          checked={
                            formData.tar_iten ===
                            (parseInt(cliente?.ITEN || "0") + 1).toString()
                          }
                          onChange={() =>
                            setFormData({
                              ...formData,
                              tar_iten: (
                                parseInt(cliente?.ITEN || "0") + 1
                              ).toString(),
                            })
                          }
                        />
                        <label className="form-check-label" htmlFor="despues">
                          Después
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Crear Cliente
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Botones;
