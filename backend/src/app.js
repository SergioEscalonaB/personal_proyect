const express = require("express");
const cobroRoutes = require("./routes/cobro.routes");

 // Crear la aplicación Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Usar las rutas de cobro
app.use("/cobro", cobroRoutes);



// Exportar la aplicación
module.exports = app;
