const { PrismaClient } = require("@prisma/client");
const { PrismaLibSql } = require("@prisma/adapter-libsql");
// Configurar el adaptador LibSQL para SQLite
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL
});
// Inicializar el cliente de Prisma con el adaptador
const prisma = new PrismaClient({ adapter });
// Exportar el cliente de Prisma
module.exports = prisma;
