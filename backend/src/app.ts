import "dotenv/config";
import express from "express";
import cobroRoutes from "./routes/cobro.routes";

// Crear la aplicación Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Ruta raíz
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World");
});

// Usar las rutas de cobro
app.use("/cobro", cobroRoutes);

// Exportar la aplicación
export default app;