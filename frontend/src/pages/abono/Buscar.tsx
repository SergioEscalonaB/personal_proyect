import { useState } from "react";
import { useAbono } from "./AbonoContext";

function Buscar() {
  const { listaClientes, busqueda } = useAbono();
  const [filtro, setFiltro] = useState("");

  const clientesFiltrados = listaClientes.filter((c) =>
    c.CLI_NOMBRE?.toLowerCase().includes(filtro.toLowerCase()),
  );

  const seleccionarCliente = (iten: string) => {
    const offset = parseInt(iten) - 1;
    busqueda(offset);
    setFiltro("");
  };

  return (
    <div>
      <h5 className="text-center mb-2">Buscar Cliente</h5>
      
      <div className="dropdown">
        <button
          className="btn btn-outline-primary dropdown-toggle w-100"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="bi bi-search me-2"></i>
          Seleccionar cliente
        </button>
        
        <ul
          className="dropdown-menu w-100 p-2"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          <li>
            <input
              className="form-control mb-2"
              placeholder="Buscar nombre..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </li>
          
          <li><hr className="dropdown-divider" /></li>
          
          {clientesFiltrados.length === 0 ? (
            <li className="dropdown-item text-muted text-center">
              Sin resultados
            </li>
          ) : (
            clientesFiltrados.map((c, i) => (
              <li key={i}>
                <button
                  className="dropdown-item d-flex justify-content-between align-items-center"
                  type="button"
                  onClick={() => seleccionarCliente(c.ITEN)}
                >
                  <span>{c.CLI_NOMBRE}</span>
                  <span className="badge bg-primary">{c.ITEN}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default Buscar;