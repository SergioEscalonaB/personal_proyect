import "bootstrap/dist/css/bootstrap.min.css";
import { useAbono } from "./AbonoContext";

export default function IniciarSalir() {
  const { cobroActivo, iniciarCobro, finalizarCobro } = useAbono();

  const handleFinalizarCobro = () => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas finalizar el cobro? Esto restablecerá todos los datos."
    );
    
    if (confirmacion) {
      finalizarCobro();
    }
  };

  return (
    <div className="d-flex flex-column align-items-center gap-2 mt-4">
      {!cobroActivo ? (
        <button 
          className="btn btn-primary btn-lg"
          onClick={iniciarCobro}
        >
          Iniciar Cobro
        </button>
      ) : (
        <button 
          className="btn btn-danger btn-lg"
          onClick={handleFinalizarCobro}
        >
          Finalizar Cobro
        </button>
      )}
      <button className="btn btn-secondary btn-lg">Salir</button>
    </div>
  );
}