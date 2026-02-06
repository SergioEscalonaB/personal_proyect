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
    tar_cuota: "",
    tar_fecha: "",
    tar_iten: "",
    tar_tiempo: "30",
    tar_fp: "S",
  });

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
      formData.tar_fp
    );
    setShowModal(false);
    setFormData({
      cli_codigo: "",
      cli_nombre: "",
      cli_calle: "",
      tar_valor: "",
      tar_cuota: "",
      tar_fecha: "",
      tar_iten: "",
      tar_tiempo: "30",
      tar_fp: "S",
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
                  <div className="mb-3">
                    <label className="form-label">Código Cliente</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.cli_codigo}
                      onChange={(e) =>
                        setFormData({ ...formData, cli_codigo: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.cli_nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, cli_nombre: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Teléfono/Calle</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.cli_calle}
                      onChange={(e) =>
                        setFormData({ ...formData, cli_calle: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Valor Tarjeta</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.tar_valor}
                      onChange={(e) =>
                        setFormData({ ...formData, tar_valor: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Cuota</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.tar_cuota}
                      onChange={(e) =>
                        setFormData({ ...formData, tar_cuota: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fecha (DD-MM-YY)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="06-02-26"
                      value={formData.tar_fecha}
                      onChange={(e) =>
                        setFormData({ ...formData, tar_fecha: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Posición (ITEN)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.tar_iten}
                      onChange={(e) =>
                        setFormData({ ...formData, tar_iten: e.target.value })
                      }
                      required
                    />
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