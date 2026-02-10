import { useEffect, useRef, useState } from "react";
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
    todosClientes,
    cargarTodosClientes,
    crearNuevaDescripcion,
    saldoRestante,
    sumaCobro,
    sumaPrestamo,
    registrarTarjetaCancelada,
    registrarTarjetaIngresada,
  } = useAbono();

  const [showModal, setShowModal] = useState(false);
  const [usarClienteExistente, setUsarClienteExistente] = useState(false);
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

  // Resetear cuando cambie el cobro seleccionado
  useEffect(() => {
    setUsarClienteExistente(false);
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
      tar_fp: "D",
    });
  }, [cobroSeleccionado]);

  // Calcular cuota automáticamente al cambiar valor del préstamo
  // tiempo o frecuencia de pago
  const calcularCuota = (valor: string, tiempo: string, fp: string) => {
    const valorReal = convertirReal(valor);
    const valorNum = parseFloat(valorReal) || 0;
    const tiempoNum = parseFloat(tiempo) || 1;

    const diasPorPeriodo: { [key: string]: number } = {
      D: 1,
      S: 7,
      Q: 15,
      M: 30,
    };

    const dias = diasPorPeriodo[fp] || 1;
    const numeroCuotas = Math.ceil(tiempoNum / dias);
    const cuotaReal =
      numeroCuotas > 0 ? Math.round(valorNum / numeroCuotas) : 0;
    return convertirMostrado(cuotaReal.toString());
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
    try {
      await crearNuevoCliente(
        formData.cli_codigo,
        formData.cli_nombre,
        formData.cli_calle,
        cobroSeleccionado.COB_CODIGO,
        convertirReal(formData.tar_valor),
        convertirReal(formData.tar_cuota),
        formData.tar_fecha,
        formData.tar_iten,
        formData.tar_tiempo,
        formData.tar_fp,
      );

      // Sumar el valor del préstamo al total del cobro
      sumaPrestamo(parseFloat(convertirReal(formData.valor_prestamo)) || 0); //tambien simplificar esto de la conversion

      //Registrar tarjeta ingresada
      registrarTarjetaIngresada(
        formData.cli_nombre,
        parseFloat(convertirReal(formData.tar_valor)) || 0,
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
    } catch (error: any) {
      if (error.message === "CLIENTE_YA_TIENE_TARJETA_ACTIVA_EN_ESTE_COBRO") {
        alert(
          `Este cliente ${formData.cli_nombre} ya tiene una tarjeta activa en este cobro`,
        );
      } else {
        alert("Ocurrió un error inesperado al crear el cliente");
        console.error(error);
      }
      return;
    }
  };

  // Cargar todos los clientes cuando se marque el checkbox
  const handleCheckboxChange = async (checked: boolean) => {
    setUsarClienteExistente(checked);
    if (checked && cobroSeleccionado) {
      await cargarTodosClientes(cobroSeleccionado.COB_CODIGO);
    }
    if (!checked) {
      setFormData({
        ...formData,
        cli_codigo: "",
        cli_nombre: "",
        cli_calle: "",
      });
    }
  };

  // Seleccionar cliente existente
  const handleClienteSelect = (clienteCodigo: string) => {
    const cliente = todosClientes.find((c) => c.CLI_CODIGO === clienteCodigo);
    if (cliente) {
      setFormData({
        ...formData,
        cli_codigo: cliente.CLI_CODIGO,
        cli_nombre: cliente.CLI_NOMBRE,
        cli_calle: cliente.CLI_CALLE || "",
      });
    }
  };

  // Función para crear cliente con tarjeta (usada tanto para nuevo cliente como para cliente existente)
  const [mostrarInputsAbono, setMostrarInputsAbono] = useState(false);
  const [guardandoAbono, setGuardandoAbono] = useState(false);
  const abonoEnprocesoRef = useRef(false);

  // Refs para manejar el enfoque de los inputs
  const inputAbonoRef = useRef<HTMLInputElement>(null);
  const inputRestaRef = useRef<HTMLInputElement>(null);

  const [formAbono, setFormAbono] = useState({
    des_abono: "",
    des_resta: "",
  });

  // Calcular saldo restante automáticamente
  const calcularSaldoRestante = () => {
    if (!cliente) return "";

    const abonoActual = parseFloat(formAbono.des_abono) || 0;
    const saldoAnterior =
      parseFloat(saldoRestante?.DES_RESTA ?? cliente?.TAR_VALOR) || 0;
    const saldoAnteriorMil = saldoAnterior / 1000;
    const nuevoSaldo = saldoAnteriorMil - abonoActual;

    return nuevoSaldo.toString();
  };

  // Función para crear nueva descripción de abono
  const saldoCalculado = calcularSaldoRestante();

  const handleAbonoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Si ambos campos están vacíos, pasar al siguiente cliente
    if (!formAbono.des_abono.trim() && !formAbono.des_resta.trim()) {
      siguiente();
      return;
    }

    // Validar que el saldo restante coincida con el calculado
    if (formAbono.des_resta !== saldoCalculado) {
      alert(`Saldo restante incorrecto. Debería ser: ${saldoCalculado}`);
      return;
    }

    if (guardandoAbono || abonoEnprocesoRef.current) {
      return;
    }

    // Marcar que se está guardando el abono para evitar envíos múltiples
    setGuardandoAbono(true);
    abonoEnprocesoRef.current = true;

    try {
      await crearNuevaDescripcion(
        convertirReal(formAbono.des_abono),
        convertirReal(formAbono.des_resta),
      );
      // Sumar el abono al total del cobro
      sumaCobro(parseFloat(convertirReal(formAbono.des_abono)) || 0); //Organizar esto para simplificar
      // Si el saldo restante es 0, registrar tarjeta cancelada
      if (parseFloat(convertirReal(formAbono.des_resta)) === 0 && cliente) {
        registrarTarjetaCancelada(
          cliente.CLI_NOMBRE,
          parseFloat(convertirReal(formAbono.des_abono)) || 0,
        );
      }
      // Limpiar los campos después de guardar
      setFormAbono({ des_abono: "", des_resta: "" });
      // Pasar al siguiente cliente automáticamente
      siguiente();
    } catch (error) {
      console.error("Error al crear la descripción del abono:", error);
      alert("Ocurrió un error al registrar el abono");
    } finally {
      setGuardandoAbono(false);
      abonoEnprocesoRef.current = false;
    }
  };

  // Enfocar automáticamente el primer input cuando se abre el formulario o cambia de cliente
  useEffect(() => {
    if (mostrarInputsAbono && inputAbonoRef.current) {
      inputAbonoRef.current.focus();
    }
  }, [mostrarInputsAbono, cliente]);

  // Manejar el Enter en el primer input (pasar al segundo)
  const handleAbonoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRestaRef.current?.focus();
    }
  };

  // Manejar el Enter en el segundo input (submit)
  const handleRestaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAbonoSubmit(e as any);
    }
  };

  // Convertir entrada a valor real (agregar 000)
  const convertirReal = (valor: string): string => {
    if (!valor.trim()) return "";

    // Convertir a número y multiplicar por 1000
    const numero = parseFloat(valor.replace(/,/g, "."));
    if (isNaN(numero)) return "";

    return (numero * 1000).toString();
  };

  // Convertir valor real a entrada (quitar 000)
  const convertirMostrado = (valor: string): string => {
    if (!valor.trim()) return "";

    const numero = parseFloat(valor);
    if (isNaN(numero)) return "";

    return (numero / 1000).toString();
  };

  // Formatear con separadores de miles para visualización
  const formatearMiles = (valor: string): string => {
    if (!valor) return "";
    const numero = parseFloat(valor);
    if (isNaN(numero)) return valor;
    return new Intl.NumberFormat("es-CO").format(numero);
  };

  if (!cobroSeleccionado) return null;

  return (
    <>
      {/* INPUTS DE ABONO (arriba de los botones) */}
      {mostrarInputsAbono && (
        <div className="mb-1" style={{ marginTop: "-15px" }}>
          <form onSubmit={handleAbonoSubmit}>
            <div className="row justify-content-center align-items-start">
              <div className="col-auto">
                <label className="form-label text-muted small mb-1">
                  Abono x1000
                </label>
                <input
                  ref={inputAbonoRef}
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="0"
                  value={formAbono.des_abono}
                  onChange={(e) =>
                    setFormAbono({ ...formAbono, des_abono: e.target.value })
                  }
                  onKeyDown={handleAbonoKeyDown}
                />
              </div>
              <div className="col-auto">
                <label className="form-label text-muted small mb-1">
                  Saldo Restante x1000
                </label>
                <input
                  ref={inputRestaRef}
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="0"
                  value={formAbono.des_resta}
                  onChange={(e) =>
                    setFormAbono({ ...formAbono, des_resta: e.target.value })
                  }
                  onKeyDown={handleRestaKeyDown}
                />
              </div>
              <div className="col-auto">
                <label className="form-label text-muted small mb-1">
                  Calculado
                </label>
                <div className="text-center">
                  <strong
                    className={
                      formAbono.des_resta &&
                      formAbono.des_resta !== saldoCalculado
                        ? "text-danger fs-5"
                        : "text-success fs-5"
                    }
                  >
                    {saldoCalculado || "—"}
                  </strong>
                  {saldoCalculado && (
                    <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                      ${formatearMiles(convertirReal(saldoCalculado))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* FILA 1 */}
      <div className="d-flex gap-3 justify-content-center align-items-center mt-0">
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
          onClick={() => setMostrarInputsAbono(!mostrarInputsAbono)}
          disabled={!cliente}
        >
          {mostrarInputsAbono ? "Cerrar Abono" : "Abrir Abono"}
        </button>
      </div>

      {/* FILA 2 */}
      <div className="d-flex gap-3 justify-content-center align-items-center mt-2">
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
                    <div className="d-flex-center gap-2 text">
                      <label className="form-label">Nombre del cliente</label>
                      <input
                        className="mb-3 ms-2 form-check-input"
                        type="checkbox"
                        checked={usarClienteExistente}
                        onChange={(e) => handleCheckboxChange(e.target.checked)}
                      />
                      {/*<small className="text-muted">Cliente existente</small>*/}
                    </div>
                    {usarClienteExistente ? (
                      <select
                        className="form-select"
                        value={formData.cli_codigo}
                        onChange={(e) => handleClienteSelect(e.target.value)}
                        required
                      >
                        <option value="">Seleccionar cliente...</option>
                        {todosClientes.map((cliente) => (
                          <option
                            key={cliente.CLI_CODIGO}
                            value={cliente.CLI_CODIGO}
                          >
                            {cliente.CLI_NOMBRE}
                          </option>
                        ))}
                      </select>
                    ) : (
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
                    )}
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
                          disabled={usarClienteExistente}
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
                          disabled={usarClienteExistente}
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
                          placeholder="300 = $300.000"
                          value={formData.valor_prestamo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              valor_prestamo: e.target.value,
                            })
                          }
                          required
                        />
                        {formData.valor_prestamo && (
                          <small className="text-muted">
                            = $
                            {formatearMiles(
                              convertirReal(formData.valor_prestamo),
                            )}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="mb-3">
                        <label className="form-label">Valor Tarjeta</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="350 = $350.000"
                          value={formData.tar_valor}
                          onChange={(e) => {
                            const nuevoValor = e.target.value;
                            const cuota = calcularCuota(
                              nuevoValor,
                              formData.tar_tiempo,
                              formData.tar_fp,
                            );
                            setFormData({
                              ...formData,
                              tar_valor: nuevoValor,
                              tar_cuota: cuota,
                            });
                          }}
                          required
                        />
                        {formData.tar_valor && (
                          <small className="text-muted">
                            = $
                            {formatearMiles(convertirReal(formData.tar_valor))}
                          </small>
                        )}
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
                        {formData.tar_cuota && (
                          <small className="text-muted">
                            = $
                            {formatearMiles(convertirReal(formData.tar_cuota))}
                          </small>
                        )}
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
