import { useAbono } from "./AbonoContext";

function Verificar() {
    const { cobroSeleccionado, offset, total, cliente } = useAbono();

    if (!cobroSeleccionado) return null

    return (
        <div className="alert alert-info text-center">
            <h4 className="alert-heading">Tarjeta actual</h4>
            <p>
                {offset + 1 } / {total} -- ITEN: {cliente?.ITEN}
            </p>
        </div>
    );
}

export default Verificar;