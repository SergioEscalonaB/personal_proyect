import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-vh-100 bg-light p-4">
      <div className="bg-white border border-4 border-secondary shadow-lg">
        {/* Header */}
        <div className="bg-secondary bg-opacity-25 px-4 py-2 border-bottom border-secondary border-2">
          <p className="mb-0 small fw-bold">Creditos Realizado por Wiliam Badillo Romero</p>
        </div>

        {/* Main Form Section */}
        <div className="border border-4 border-danger m-2 p-4 bg-light">
          <div className="row mb-4 align-items-center">
            <div className="col-md-4 d-flex align-items-center gap-2">
              <label className="fw-bold me-2">Codigo del Cobro</label>
              <select className="form-select border-primary border-2 bg-primary bg-opacity-25">
                <option></option>
              </select>
            </div>
            <div className="col-md-3"></div>
            <div className="col-md-5 d-flex align-items-center gap-2 justify-content-end">
              <button className="btn btn-secondary border-2">Modificar</button>
              <label className="fw-bold mb-0">Plazo (Dias)</label>
              <input type="text" className="form-control border-2" style={{width: '80px'}} />
              <label className="fw-bold mb-0">FP</label>
              <input type="text" className="form-control border-2" style={{width: '80px'}} />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-2">
              <label className="fw-bold">Cedula</label>
              <input type="text" className="form-control border-2" />
            </div>
            <div className="col-md-4">
              <label className="fw-bold">Nombre Del Cliente</label>
              <input type="text" className="form-control border-2" />
            </div>
            <div className="col-md-4">
              <label className="fw-bold">Dir - Tel</label>
              <input type="text" className="form-control border-2" />
            </div>
            <div className="col-md-2">
              <label className="fw-bold">Dias Vencidos</label>
              <input type="text" className="form-control border-2 bg-warning" />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-md-3">
              <label className="fw-bold">Valor</label>
              <input type="text" className="form-control border-2" />
            </div>
            <div className="col-md-3">
              <label className="fw-bold">Cuota</label>
              <input type="text" className="form-control border-2" />
            </div>
            <div className="col-md-3">
              <label className="fw-bold">Fecha</label>
              <input type="text" className="form-control border-2" />
            </div>
            <div className="col-md-3">
              <label className="fw-bold">Saldo</label>
              <input type="text" className="form-control border-2 bg-success bg-opacity-25" />
            </div>
          </div>
        </div>

        {/* Three Column Section */}
        <div className="row g-2 m-2">
          {/* Left Column - Options */}
          <div className="col-md-2">
            <div className="border border-4 border-warning bg-white p-3">
              <div className="mb-4">
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="check1" />
                  <label className="form-check-label small fw-semibold" htmlFor="check1">
                    Colocar Fecha del sistema
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="check2" />
                  <label className="form-check-label small fw-semibold" htmlFor="check2">
                    Descontar de la suma del cobro
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="check3" />
                  <label className="form-check-label small fw-semibold" htmlFor="check3">
                    Crear Prestamo Sin Sumar a Prest.
                  </label>
                </div>
              </div>

              <div className="border-top pt-3">
                <p className="text-muted fw-semibold mb-2">Nuevo Clientes</p>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="radio" name="nuevo" id="antes" />
                  <label className="form-check-label text-muted" htmlFor="antes">
                    Antes
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="nuevo" id="despues" />
                  <label className="form-check-label text-muted" htmlFor="despues">
                    Despues
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Description Table */}
          <div className="col-md-6">
            <div className="border border-4 border-primary bg-light p-3">
              <div className="mb-3">
                <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                  <label className="fw-bold text-center mb-0">DESCRIPCION</label>
                  <label className="fst-italic mb-0">dd-mm-aa</label>
                </div>
                <table className="table table-bordered border-dark small">
                  <thead>
                    <tr className="bg-white">
                      <th className="border border-dark p-2">Fecha Actual/Abono</th>
                      <th className="border border-dark p-2">FECHA</th>
                      <th className="border border-dark p-2">ABONO</th>
                      <th className="border border-dark p-2">RESTA</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="border border-dark p-2"></td>
                      <td className="border border-dark p-2"></td>
                      <td className="border border-dark p-2"></td>
                      <td className="border border-dark p-2"></td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-dark p-2"></td>
                      <td className="border border-dark p-2"></td>
                      <td className="border border-dark p-2"></td>
                      <td className="border border-dark p-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="border border-2 bg-secondary bg-opacity-10" style={{height: '256px'}}></div>
            </div>
          </div>

          {/* Right Column - Calculations */}
          <div className="col-md-4">
            <div className="border border-4 border-success bg-white p-3">
              <div className="bg-warning mb-3" style={{height: '32px'}}></div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="text-primary fw-bold mb-0">COBRO</label>
                  <input type="text" className="form-control border-secondary" style={{width: '128px'}} />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="text-primary fw-bold mb-0 ms-3">- PRESTAMO</label>
                  <input type="text" className="form-control border-secondary" style={{width: '128px'}} />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="text-primary fw-bold mb-0 ms-4">- GASTOS</label>
                  <div className="d-flex gap-1">
                    <input type="text" className="form-control border-secondary" style={{width: '80px'}} />
                    <label className="fw-bold mb-0">Ot Gas</label>
                    <input type="text" className="form-control border-secondary" style={{width: '64px'}} />
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="text-primary fw-bold mb-0 ms-5">+ BASE</label>
                  <input type="text" className="form-control border-secondary" style={{width: '128px'}} />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="text-primary fw-bold mb-0 ms-3">-DESCUENTO</label>
                  <input type="text" className="form-control border-secondary" style={{width: '128px'}} />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="text-primary fw-bold mb-0 ms-4">Efectivo</label>
                  <input type="text" className="form-control border-secondary bg-success bg-opacity-25" style={{width: '128px'}} />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="text-primary fw-bold mb-0">Diferen</label>
                  <input type="text" className="form-control border-secondary bg-warning" style={{width: '128px'}} />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="bg-danger text-white fw-bold px-3 py-2">
                  SIN GUARDAR
                </div>
                <div className="bg-primary text-white fw-bold px-3 py-2">
                  02-feb-26
                </div>
              </div>

              <div className="mb-3">
                <h3 className="fw-bold text-center mb-2 h6">TARJETAS CANCELADAS</h3>
                <div className="bg-warning" style={{height: '64px'}}></div>
              </div>

              <div className="mb-3">
                <h3 className="fw-bold text-center mb-2 h6">PRESTAMOS INGRESADOS</h3>
                <div className="bg-info" style={{height: '64px'}}></div>
              </div>

              <div>
                <label className="fw-bold mb-2">Buscar</label>
                <select className="form-select border-2 mb-3">
                  <option></option>
                </select>
                <label className="fw-bold mb-2">Cedula</label>
                <input type="text" className="form-control border-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Section */}
        <div className="border border-4 border-info m-2 p-4 bg-light">
          <div className="row">
            <div className="col-md-2">
              <div className="d-grid gap-2">
                <button className="btn btn-secondary border-2">Llenar</button>
                <button className="btn btn-secondary border-2">CODEUDOR</button>
                <button className="btn btn-secondary border-2">FINANCIAR</button>
              </div>
            </div>

            <div className="col-md-6">
              <div className="d-flex flex-column justify-content-center h-100">
                <div className="d-flex justify-content-center gap-2 mb-4">
                  <button className="btn btn-secondary border-2">Abono</button>
                  <button className="btn btn-secondary border-2">Guardar</button>
                  <button className="btn btn-secondary border-2">Cancelar</button>
                  <button className="btn btn-secondary border-2">Nuevo Cliente</button>
                  <button className="btn btn-secondary border-2">Modificar</button>
                  <button className="btn btn-secondary border-2">Salir</button>
                </div>
                <div className="d-flex justify-content-center gap-2">
                  <button className="btn btn-secondary border-2">Primero</button>
                  <button className="btn btn-secondary border-2">Anterior</button>
                  <button className="btn btn-secondary border-2">Siguiente</button>
                  <button className="btn btn-secondary border-2">Ultimo</button>
                </div>
              </div>
            </div>

            <div className="col-md-4 d-flex flex-column justify-content-center align-items-center">
              <button className="btn btn-secondary border-2 mb-3">Verificar</button>
              <label className="fw-bold fs-4">#Targeta</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;