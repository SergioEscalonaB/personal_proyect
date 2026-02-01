require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { PrismaLibSql } = require("@prisma/adapter-libsql");
const app = express();
const port = 3000;

// Función para resolver la ruta del archivo SQLite desde DATABASE_URL
function resolveSqlitePath(databaseUrl) {
  if (!databaseUrl) return null;
  if (!databaseUrl.startsWith("file:")) return null;
 // Extraer la ruta del archivo
  let filePath = databaseUrl.replace(/^file:/, "");
  filePath = filePath.split("?")[0];
// Devolver la ruta absoluta
  return path.resolve(process.cwd(), filePath);
}
// Verificar que el archivo de la base de datos SQLite existe
const dbFilePath = resolveSqlitePath(process.env.DATABASE_URL);
if (!dbFilePath || !fs.existsSync(dbFilePath)) {
  console.error("La base de datos SQLite no existe:", dbFilePath || process.env.DATABASE_URL);
  process.exit(1);
}
// Configurar Prisma con el adaptador LibSQL
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/cobro", async (req, res) => {
  try {
    const rows = await prisma.cOBRO.findMany();
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor listo en http://localhost:${port}`);
});
