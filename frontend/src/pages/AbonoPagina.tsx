import "bootstrap/dist/css/bootstrap.min.css";
import { AbonoProvider } from "./abono/AbonoContext.tsx";
import Selector from "./abono/Usuario.tsx";
import Botones from "./abono/Botones.tsx";
import Descripcion from "./abono/Descripcion.tsx";
import Verificar from "./abono/verificar.tsx";
import Liquidacion from "./abono/Liquidacion.tsx";
import IniciarSalir from "./abono/iniciar-salir.tsx";
import Buscar from "./abono/Buscar.tsx";

function AbonoPage() {
  return (
    <AbonoProvider>
      <div className="container-fluid px-3 py-2">
        {/* FILA 1 */}
        <div className="row g-2">
          <div
            className="col-12 border p-3 text-center"
            style={{ height: "20vh" }}
          >
            <Selector />
          </div>
        </div>

        {/* FILA 2 */}
        <div className="row g-2">
          <div
            className="col-2 border p-3 text-center"
            style={{ height: "55vh" }}
          >
            2
          </div>
          <div
            className="col-5 border p-3 text-center"
            style={{ height: "55vh" }}
          >
            <Descripcion />
          </div>
          <div
            className="col-5 border p-3"
            style={{ height: "55vh", overflow: "hidden" }}
          >
            <Liquidacion />
          </div>
        </div>

        {/* FILA 3 */}
        <div className="row g-2">
          <div
            className="col-2 border p-3 text-center"
            style={{ height: "23vh" }}
          >
            <Buscar />
          </div>
          <div
            className="col-5 border p-3 d-flex flex-column justify-content-center align-items-center"
            style={{ height: "23vh" }}
          >
            <Botones />
          </div>
          <div
            className="col-3 border p-3 text-center"
            style={{ height: "23vh" }}
          >
            <Verificar />
          </div>
          <div
            className="col-2 border p-3 text-center"
            style={{ height: "23vh" }}
          >
            <IniciarSalir />
          </div>
        </div>
      </div>
    </AbonoProvider>
  );
}

export default AbonoPage;
