import "bootstrap/dist/js/bootstrap.min.js";
import { useEffect, useState } from "react";
import type { Cobro } from "../../types/cobro";
import { todoscobros } from "../../services/cobros";

function Selector() {
  const [cobros, setCobros] = useState<Cobro[]>([]);
  const [cobroSeleccionado, setCobroSeleccionado] = useState<Cobro | null>(
    null,
  );

  useEffect(() => {
    todoscobros().then((data) => {
      setCobros(data);
    });
  }, []);

  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {cobroSeleccionado
          ? cobroSeleccionado.COB_CODIGO
          : "Seleccione un cobro"}
      </button>

      <ul className="dropdown-menu">
        {cobros.map((cobro) => (
          <li key={cobro.COB_CODIGO}>
            <button
              className="dropdown-item"
              onClick={() => setCobroSeleccionado(cobro)}
            >
              {cobro.COB_CODIGO}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Selector;
