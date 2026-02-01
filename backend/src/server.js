require("dotenv").config();
const fs = require("fs");
const path = require("path");
const app = require("./app");

// Validación SQLite
function resolveSqlitePath(databaseUrl) {
  if (!databaseUrl?.startsWith("file:")) return null;
  let filePath = databaseUrl.replace(/^file:/, "").split("?")[0];
  return path.resolve(process.cwd(), filePath);
}
// Verificar que el archivo de la base de datos SQLite existe
const dbFilePath = resolveSqlitePath(process.env.DATABASE_URL);
if (!dbFilePath || !fs.existsSync(dbFilePath)) {
  console.error("La base de datos SQLite no existe:", dbFilePath);
  process.exit(1);
}
// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor listo en http://localhost:${port}`);
});
