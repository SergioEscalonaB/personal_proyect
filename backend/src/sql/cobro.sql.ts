import prisma from "../prisma/client";
import type { COBRO } from "@prisma/client";

type Cobro = {
  COB_CODIGO : string;
  COB_NOMBRE : string;
  COB_DIRECCION : string;
  COB_MOTO : string;
  COB_TELEFONO : string;
};

// Obtener todos los registros de la tabla COBRO
export const getCobroSQL = () => {
  return prisma.$queryRaw<COBRO[]>`
    SELECT *
    FROM COBRO
  `;
};

/*
// Obtener todos los registros de la tabla COBRO metodo prisma normal
export const getCobroPrisma = async () => {
  return prisma.cOBRO.findMany();
};
*/

/*
//Crear un nuevo cobro metodo sql
export const createCobroSQL = (cobro: Cobro) => {
  return prisma.$queryRaw<COBRO[]>`
    INSERT INTO COBRO (COB_CODIGO, COB_NOMBRE, COB_DIRECCION, COB_MOTO, COB_TELEFONO)
    VALUES (${cobro.COB_CODIGO}, ${cobro.COB_NOMBRE}, ${cobro.COB_DIRECCION}, ${cobro.COB_MOTO}, ${cobro.COB_TELEFONO})
  `;
};
*/

//Crear un nuevo cobro metodo prisma normal
export const createCobroSQL = async (cobro: Cobro) => {
  return prisma.cOBRO.create({
    data: {
      COB_CODIGO: cobro.COB_CODIGO,
      COB_NOMBRE: cobro.COB_NOMBRE,
      COB_DIRECCION: cobro.COB_DIRECCION,
      COB_MOTO: cobro.COB_MOTO,
      COB_TELEFONO: cobro.COB_TELEFONO
    }
  });
}; 

/*
// Actualizar cobro por codigo metodo sql
export const updateCobroSQL = (cobroCodigo: string, cobro: Cobro) => {
  return prisma.$queryRaw<COBRO[]>`
    UPDATE COBRO
    SET COB_NOMBRE = COALESCE(${cobro.COB_NOMBRE}, COB_NOMBRE),
        COB_DIRECCION = COALESCE(${cobro.COB_DIRECCION}, COB_DIRECCION),
        COB_MOTO = COALESCE(${cobro.COB_MOTO}, COB_MOTO),
        COB_TELEFONO = COALESCE(${cobro.COB_TELEFONO}, COB_TELEFONO)
    WHERE COB_CODIGO = ${cobroCodigo}
  `;
};
*/

// Actualizar cobro por codigo metodo prisma normal
export const updateCobroSQL = async (cobroCodigo: string, cobro: Cobro) => {
  return prisma.cOBRO.update({
    where: {
      COB_CODIGO: cobroCodigo
    },
    data: {
      COB_NOMBRE: cobro.COB_NOMBRE,
      COB_DIRECCION: cobro.COB_DIRECCION,
      COB_MOTO: cobro.COB_MOTO,
      COB_TELEFONO: cobro.COB_TELEFONO
    }
  });
};

// Eliminar cobro por codigo metodo sql
export const deleteCobroSQL = (cobroCodigo: string) => {
  return prisma.$queryRaw<COBRO[]>`
    DELETE FROM COBRO
    WHERE COB_CODIGO = ${cobroCodigo}
  `;
}; 

/*
//Eliminar cobro por codigo metodo prisma normal
export const deleteCobroSQL = async (cobroCodigo: string) => {
  return prisma.cOBRO.delete({
    where: {
      COB_CODIGO: cobroCodigo
    }
  });
};
  */


