import prisma from "../prisma/client";
import { CLIENTES } from "@prisma/client";

type Clientes = {
  CLI_CODIGO: string;
  CLI_NOMBRE: string;
  CLI_CALLE: string;
  COB_CODIGO: string;
  ESTADO: string;
};

// Obtener todos los clientes metodo sql
export const getClientesSQL = () => {
  return prisma.$queryRaw<CLIENTES[]>`
    SELECT *
    FROM CLIENTES
  `;
};

/*
// Obtener todos los clientes metodo prisma normal
export const getClientesSQL = async () => {
  return prisma.cLIENTES.findMany();
};
*/
