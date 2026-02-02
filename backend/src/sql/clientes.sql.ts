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

// Obtener un cliente por su código sql
export const getClientePorCodigoSQL = (clienteCodigo: string) => {
  return prisma.$queryRaw<CLIENTES[]>`
    SELECT *
    FROM CLIENTES
    WHERE CLI_CODIGO = ${clienteCodigo}
  `;
};

/*
// Obtener un cliente por su código prisma normal
export const getClientePorCodigoSQL = async (clienteCodigo: string) => {
  return prisma.cLIENTES.findUnique({
    where: {
      CLI_CODIGO: clienteCodigo
    }
  });
};
*/

/*
// Crear un nuevo cliente sin tarjeta metodo sql
export const createClienteSQL = (cliente: Clientes) => {
  return prisma.$queryRaw<CLIENTES[]>`
    INSERT INTO CLIENTES (CLI_CODIGO, CLI_NOMBRE, CLI_CALLE, COB_CODIGO, ESTADO)
    VALUES (${cliente.CLI_CODIGO}, ${cliente.CLI_NOMBRE}, ${cliente.CLI_CALLE}, ${cliente.COB_CODIGO}, ${cliente.ESTADO})
  `;
};
*/

//Crear un cliente sin tarjeta metodo prisma normal
export const createClienteSQL = async (cliente: Clientes) => {
  return prisma.cLIENTES.create({
    data: {
      CLI_CODIGO: cliente.CLI_CODIGO,
      CLI_NOMBRE: cliente.CLI_NOMBRE,
      CLI_CALLE: cliente.CLI_CALLE,
      COB_CODIGO: cliente.COB_CODIGO,
      ESTADO: cliente.ESTADO,
    },
  });
};

/*
// Actualizar un cliente por su codigo metodo sql
export const updateClienteSQL = (clienteCodigo: string, cliente: Clientes) => {
  return prisma.$queryRaw<CLIENTES[]>`
    UPDATE CLIENTES
    SET CLI_NOMBRE = COALESCE(${cliente.CLI_NOMBRE}, CLI_NOMBRE),
        CLI_CALLE = COALESCE(${cliente.CLI_CALLE}, CLI_CALLE),
        COB_CODIGO = COALESCE(${cliente.COB_CODIGO}, COB_CODIGO),
        ESTADO = COALESCE(${cliente.ESTADO}, ESTADO)
    WHERE CLI_CODIGO = ${clienteCodigo}
  `;
};
*/

// Actualizar un cliente por su codigo metodo prisma normal
export const updateClienteSQL = async (clienteCodigo: string, cliente: Clientes) => {
  return prisma.cLIENTES.update({
    where: {
      CLI_CODIGO: clienteCodigo,
    },
    data: {
      CLI_NOMBRE: cliente.CLI_NOMBRE,
      CLI_CALLE: cliente.CLI_CALLE,
      COB_CODIGO: cliente.COB_CODIGO,
      ESTADO: cliente.ESTADO,
    },
  });
};

/*
//Eliminar un cliente por su codigo metodo sql
export const deleteClienteSQL = (clienteCodigo: string) => {
  return prisma.$queryRaw<CLIENTES[]>`
    DELETE FROM CLIENTES
    WHERE CLI_CODIGO = ${clienteCodigo}
  `;
};
*/

//Eliminar un cliente por su codigo metodo prisma normal
export const deleteClienteSQL = async (clienteCodigo: string) => {
  return prisma.cLIENTES.delete({
    where: {
      CLI_CODIGO: clienteCodigo,
    },
  });
};
