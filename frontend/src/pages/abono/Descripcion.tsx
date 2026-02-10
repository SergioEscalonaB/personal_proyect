import { useAbono } from "./AbonoContext";

function Descripcion() {
  const { cobroSeleccionado, cliente, descripcion } = useAbono();

  // Si no hay cobro o cliente, no mostramos nada
  if (!cobroSeleccionado || !cliente) return null;

  return (
    <div className="h-100 d-flex flex-column"> {/* Usando toda la altura disponible para ajustar*/}
      <h2 className="mb-2">Descripción de la tarjeta</h2>

      {descripcion.length === 0 ? (
        <p>No hay movimientos para esta tarjeta</p>
      ) : (
        <div className="flex-grow-1 overflow-auto"> {/* Ocupar el resto del espacio con scroll */}
          <table className="table table-bordered table-sm mb-0">
            <thead className="sticky-top bg-white">
              <tr>
                <th>Fecha Act.</th>
                <th>Fecha</th>
                <th>Abono</th>
                <th>Saldo</th>
              </tr>
            </thead>

            <tbody>
              {descripcion.map((d, i) => (
                <tr key={i}>
                  <td>{d.FECHA_ACT ?? ""}</td>
                  <td>{d.DES_FECHA}</td>
                  <td>${Number(d.DES_ABONO).toLocaleString()}</td>
                  <td>${Number(d.DES_RESTA).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Descripcion;