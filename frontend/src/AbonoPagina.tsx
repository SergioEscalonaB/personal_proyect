import 'bootstrap/dist/css/bootstrap.min.css'
import { AbonoProvider } from './pages/abono/AbonoContext.tsx'
import Selector from './pages/abono/Usuario.tsx'
import Botones from './pages/abono/Botones.tsx'

function AbonoPage() {
  return (
    <AbonoProvider>
    <div className="container-fluid px-3 py-2">

      {/* FILA 1 */}
      <div className="row g-2">
        <div className="col-12 border p-3 text-center" style={{ height: '25vh' }}>
          <Selector />
        </div>
      </div>

      {/* FILA 2 */}
      <div className="row g-2">
        <div className="col-2 border p-3 text-center" style={{ height: '50vh' }}>
          2
        </div>
        <div className="col-5 border p-3 text-center" style={{ height: '50vh' }}>
          3
        </div>
        <div className="col-5 border p-3 text-center" style={{ height: '50vh' }}>
          4
        </div>
      </div>

      {/* FILA 3 */}
      <div className="row g-2">
        <div className="col-2 border p-3 text-center" style={{ height: '20vh' }}>
          5
        </div>
        <div className="col-5 border p-3 text-center" style={{ height: '20vh' }}>
          <Botones />
        </div>
        <div className="col-3 border p-3 text-center" style={{ height: '20vh' }}>
          7
        </div>
        <div className="col-2 border p-3 text-center" style={{ height: '20vh' }}>
          8
        </div>
      </div>

    </div>
    </AbonoProvider>
  )
}

export default AbonoPage