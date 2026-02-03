import prisma from "../prisma/client";
import { COBRO } from "@prisma/client";
import { CLIENTES } from "@prisma/client";

type Cobro = {
  COB_CODIGO: string;
  COB_NOMBRE: string;
  COB_DIRECCION: string;
  COB_MOTO: string;
  COB_TELEFONO: string;
};

type Clientes = {
  CLI_CODIGO: string;
  CLI_NOMBRE: string;
  CLI_CALLE: string;
  COB_CODIGO: string;
  ESTADO: string;
};

// Obtener todos los cobros
export const getCobrosSQL = () => {
  return prisma.$queryRaw<COBRO[]>`
        SELECT *
        FROM COBRO
    `;
};

// Obtener todos los clientes de un cobro especifico metodo sql
export const getclientesPorCobroSQL = (cobroCodigo: string) => {
  return prisma.$queryRaw<CLIENTES[]>`
        SELECT *
        FROM CLIENTES
        WHERE COB_CODIGO = ${cobroCodigo}
    `;
};

// OBTENIENDO LAS TARJETAS QUE NO ESTAN EN 0
// ESTAN SON LAS QUE SE MUESTRAN EN EL COBRO
// ESTO PARA CONTAL EL TOTAL
export const getTarjetasConSaldoSQL = (cobroCodigo: string) => {
  return prisma.$queryRaw<CLIENTES[]>`
        SELECT COUNT(*) as total
FROM CLIENTES C
INNER JOIN TARGETA T
    ON C.CLI_CODIGO = T.CLI_CODIGO

LEFT JOIN (
    SELECT TAR_CODIGO, DES_RESTA
    FROM (
        SELECT 
            TAR_CODIGO,
            DES_RESTA,
            ROW_NUMBER() OVER (PARTITION BY TAR_CODIGO ORDER BY DES_FECHA DESC) AS rn,
            MAX(CASE WHEN DES_RESTA = 0 THEN 1 ELSE 0 END)
                OVER (PARTITION BY TAR_CODIGO) AS tuvo_cero
        FROM DESCRIPCION
    ) X
    WHERE rn = 1
      AND tuvo_cero = 0
) D ON T.TAR_CODIGO = D.TAR_CODIGO

WHERE T.ESTADO = 'ACTIVA'
  AND C.COB_CODIGO = 'Yayo'
  -- esta línea permite tarjetas nuevas SIN descripción
  AND (D.TAR_CODIGO IS NOT NULL OR NOT EXISTS (
        SELECT 1 
        FROM DESCRIPCION D2 
        WHERE D2.TAR_CODIGO = T.TAR_CODIGO
      ))
    `;
};

// Navegar entre tarjetas con saldo
export const getTarjetaNavegacionSQL = (
  cobroCodigo: string,
  offset: number
) => {
  return prisma.$queryRaw<CLIENTES[]>`
    SELECT *
    FROM CLIENTES C
    INNER JOIN TARGETA T
        ON C.CLI_CODIGO = T.CLI_CODIGO

    LEFT JOIN (
        SELECT TAR_CODIGO, DES_RESTA
        FROM (
            SELECT 
                TAR_CODIGO,
                DES_RESTA,
                ROW_NUMBER() OVER (PARTITION BY TAR_CODIGO ORDER BY DES_FECHA DESC) AS rn,
                MAX(CASE WHEN DES_RESTA = 0 THEN 1 ELSE 0 END)
                    OVER (PARTITION BY TAR_CODIGO) AS tuvo_cero
            FROM DESCRIPCION
        ) X
        WHERE rn = 1
          AND tuvo_cero = 0
    ) D ON T.TAR_CODIGO = D.TAR_CODIGO

    WHERE T.ESTADO = 'ACTIVA'
      AND C.COB_CODIGO = ${cobroCodigo}
      AND (
        D.TAR_CODIGO IS NOT NULL 
        OR NOT EXISTS (
            SELECT 1 
            FROM DESCRIPCION D2 
            WHERE D2.TAR_CODIGO = T.TAR_CODIGO
        )
      )

    ORDER BY CAST(T.ITEN AS SIGNED)
    LIMIT 1 OFFSET ${offset};
  `;
};