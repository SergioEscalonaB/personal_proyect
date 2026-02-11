import 'bootstrap/dist/css/bootstrap.min.css'
import { AbonoProvider } from './pages/abono/AbonoContext.tsx'
import Selector from './pages/abono/Usuario.tsx'
import Botones from './pages/abono/Botones.tsx'
import Descripcion from './pages/abono/Descripcion.tsx'
import Verificar from './pages/abono/verificar.tsx'
import Liquidacion from './pages/abono/Liquidacion.tsx'
import IniciarSalir from './pages/abono/iniciar-salir.tsx'

function AbonoPage() {
  return (
    <AbonoProvider>
    <div className="container-fluid px-3 py-2">

      {/* FILA 1 */}
      <div className="row g-2">
        <div className="col-12 border p-3 text-center" style={{ height: '20vh' }}>
          <Selector />
        </div>
      </div>

      {/* FILA 2 */}
      <div className="row g-2">
        <div className="col-2 border p-3 text-center" style={{ height: '55vh' }}>
          2
        </div>
        <div className="col-5 border p-3 text-center" style={{ height: '55vh' }}>
          <Descripcion />
        </div>
        <div className="col-5 border p-3" style={{ height: '55vh', overflow: 'hidden' }}>
          <Liquidacion />
        </div>
      </div>

      {/* FILA 3 */}
      <div className="row g-2">
        <div className="col-2 border p-3 text-center" style={{ height: '23vh' }}>
          5
        </div>
        <div className="col-5 border p-3 d-flex flex-column justify-content-center align-items-center" style={{ height: '23vh' }}>
          <Botones />
        </div>
        <div className="col-3 border p-3 text-center" style={{ height: '23vh' }}>
          <Verificar />
        </div>
        <div className="col-2 border p-3 text-center" style={{ height: '23vh' }}>
          <IniciarSalir />
        </div>
      </div>

    </div>
    </AbonoProvider>
  )
}

export default AbonoPage