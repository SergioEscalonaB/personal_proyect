import { useAbono } from "./AbonoContext";

function Descripcion() {
  const { cobroSeleccionado, cliente, descripcion } = useAbono();

  // Si no hay cobro o cliente, no mostramos nada
  if (!cobroSeleccionado || !cliente) return null;

  return (
    <div>
      <h2>Descripción de la tarjeta</h2>

      {descripcion.length === 0 ? (
        <p>No hay movimientos para esta tarjeta</p>
      ) : (
        <table className="table table-bordered table-sm">
          <thead>
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
                {/* FECHA_ACT solo en la primera fila */}
                <td>{d.FECHA_ACT ?? ""}</td>
                <td>{d.DES_FECHA}</td>
                <td>${Number(d.DES_ABONO).toLocaleString()}</td>
                <td>${Number(d.DES_RESTA).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Descripcion;
