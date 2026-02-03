import "dotenv/config";
import express from "express";
import cobroRoutes from "./routes/cobro.routes";
import clienteRoutes from "./routes/cliente.routes";
import abonoPageRoutes from "./routes/abonopage.routes";
import cors from "cors";

// Crear la aplicación Express
const app = express();

// Configurar CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173", // frontend (Vite)
      "http://localhost:3000", // backend (Node.js)
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
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

// Usar la ruta de abonopage
app.use("/abonopage", abonoPageRoutes);

// Exportar la aplicación
export default app;
