import { useAbono } from "./AbonoContext";

function Botones() {
  const {
    offset,
    cliente,
    anterior,
    siguiente,
    ultimo,
    cobroSeleccionado,
  } = useAbono();

  if (!cobroSeleccionado) return null;

  return (
    <>
      <div className="d-flex gap-3 justify-content-center align-items-center">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={anterior}
          disabled={offset === 0}
        >
          ← Anterior
        </button>

        <span className="fw-bold">
          Tarjeta {offset + 1}
        </span>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={siguiente}
          disabled={!cliente}
        >
          Siguiente →
        </button>
      </div>

      <button
        className="btn btn-outline-primary btn-sm"
        onClick={ultimo}
        disabled={!cliente}
      >
        Ultimo
      </button>
    </>
  );
}

export default Botones;
