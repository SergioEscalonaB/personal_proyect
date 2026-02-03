import "dotenv/config";
import express from "express";
import cobroRoutes from "./routes/cobro.routes";
import clienteRoutes from "./routes/cliente.routes";
import cors from "cors";

// Crear la aplicación Express
const app = express();

// Configurar CORS
app.use(
  cors({
    origin: "http://localhost:5173", // frontend (Vite)
  })
);

// Middleware para parsear JSON
app.use(express.json());

// Ruta raíz
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World");
});

// Usar las rutas de cobro
app.use("/cobros", cobroRoutes);

// Usar la ruta de clientes
app.use("/clientes", clienteRoutes);

// Exportar la aplicación
export default app;