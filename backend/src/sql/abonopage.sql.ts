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

type ClienteConTarjeta = {
  // Datos del cliente
  CLI_CODIGO: string;
  CLI_NOMBRE: string;
  CLI_CALLE: string;
  COB_CODIGO: string;
  ESTADO: string;
  // Datos de la tarjeta
  TAR_CODIGO: string;
  TAR_VALOR: number;
  TAR_CUOTA: number;
  TAR_FECHA: Date;
  ITEN: number;
  TIEMPO: number;
  FP: string;
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
        GROUP BY CLI_NOMBRE
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
  AND C.COB_CODIGO = ${cobroCodigo}
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
  offset: number,
) => {
  return prisma.$queryRaw<ClienteConTarjeta[]>`
    SELECT C.CLI_CODIGO, C.CLI_NOMBRE, C.CLI_CALLE, 
    C.COB_CODIGO, C.ESTADO, T.TAR_CODIGO, T.TAR_VALOR, 
    T.TAR_CUOTA, T.TAR_FECHA, T.ITEN, T.ESTADO, T.TIEMPO, T.FP, T.PRES, T.UTILIDAD
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

// Obtener la descripcion de una tarjeta especifica
export const getDescripcionTarjetaSQL = (tarcodigo: string) => {
  return prisma.$queryRaw<any[]>`
        SELECT  
      T.TAR_CODIGO, 
      T.TAR_FECHA, 
      T.TAR_VALOR,
      D.FECHA_ACT, 
      D.DES_FECHA, 
      D.DES_ABONO, 
      D.DES_RESTA 
    FROM TARGETA T
INNER JOIN DESCRIPCION D
ON T.TAR_CODIGO = D.TAR_CODIGO
WHERE D.TAR_CODIGO = ${tarcodigo}
ORDER BY TAR_FECHA, CAST(DES_RESTA AS SIGNED) DESC;
    `;
};

// Obtener el saldo restante de una tarjeta
export const getSaldoRestanteSQL = (tarcodigo: string) => {
  return prisma.$queryRaw<any[]>`
  SELECT D.DES_RESTA
FROM CLIENTES C
INNER JOIN TARGETA T ON C.CLI_CODIGO = T.CLI_CODIGO
INNER JOIN DESCRIPCION D ON T.TAR_CODIGO = D.TAR_CODIGO
WHERE D.TAR_CODIGO = ${tarcodigo}
ORDER BY C.CLI_CODIGO, TAR_FECHA, CAST(DES_RESTA AS INTEGER) DESC
LIMIT 1
OFFSET (
    SELECT COUNT(*) - 1
    FROM DESCRIPCION
    WHERE TAR_CODIGO = ${tarcodigo}
);
    `;
};

// Crear un nuevo cliente con tarjeta, desplazando las tarjetas existentes (ordenado por ITEN)
// para hacer espacio para la nueva tarjeta en la posición deseada
export const crearClienteConTarjetaSQL = async (
  cli_codigo: string,
  cli_nombre: string,
  cli_calle: string,
  cob_codigo: string,
  tar_valor: string,
  tar_cuota: string,
  tar_fecha: string,
  tar_iten: string,
  tar_tiempo: string,
  tar_fp: string,
  tar_pres: string,
  tar_utilidad: string,
) => {
  // Validar que el cliente no tenga una tarjeta activa en el mismo cobro
  const existe = await prisma.$queryRaw<
    { total: number; cob_codigo: string; tar_codigo: string }[]
  >`
    SELECT COUNT(*) as total, C.COB_CODIGO as cob_codigo, T.TAR_CODIGO as tar_codigo
    FROM TARGETA T
    INNER JOIN CLIENTES C ON T.CLI_CODIGO = C.CLI_CODIGO
    WHERE T.CLI_CODIGO = ${cli_codigo}
      AND T.ESTADO = 'ACTIVA'
  `;

  if (existe[0].total > 0) {
    throw new Error(
      `CLIENTE_YA_EXISTE|${existe[0].cob_codigo}|${existe[0].tar_codigo}`,
    ); // El cliente ya tiene una tarjeta activa en este cobro
  }

  // Verificar si el cliente ya existe en la base de datos
  const clienteExistente = await prisma.$queryRaw<{ total: number }[]>`
    SELECT COUNT(*) as total
    FROM CLIENTES
    WHERE CLI_CODIGO = ${cli_codigo}
  `;

  return await prisma.$transaction([
    // 1. Desplazar tarjetas existentes
    prisma.$executeRaw`
      UPDATE TARGETA 
      SET ITEN = CAST(ITEN AS INTEGER) + 1
      WHERE TAR_CODIGO IN (
        SELECT T.TAR_CODIGO
        FROM TARGETA T
        INNER JOIN CLIENTES C ON T.CLI_CODIGO = C.CLI_CODIGO
        WHERE C.COB_CODIGO = ${cob_codigo}
        AND CAST(T.ITEN AS INTEGER) >= ${tar_iten}
      )
    `,
    // 2. Insertar o actualizar cliente
    clienteExistente[0].total > 0
      ? // Si existe, actualizar
        prisma.$executeRaw`
          UPDATE CLIENTES
          SET CLI_NOMBRE = ${cli_nombre},
              CLI_CALLE = ${cli_calle},
              COB_CODIGO = ${cob_codigo},
              ESTADO = 'ACTIVO'
          WHERE CLI_CODIGO = ${cli_codigo}
        `
      : // Si no existe, insertar
        prisma.$executeRaw`
          INSERT INTO CLIENTES (CLI_CODIGO, CLI_NOMBRE, CLI_CALLE, COB_CODIGO, ESTADO)
          VALUES (${cli_codigo}, ${cli_nombre}, ${cli_calle}, ${cob_codigo}, 'ACTIVO')
    `,
    // 3. Insertar tarjeta en la posición deseada
    prisma.$executeRaw`
      INSERT INTO TARGETA (TAR_CODIGO, CLI_CODIGO, TAR_VALOR, TAR_CUOTA, TAR_FECHA, ITEN, ESTADO, TIEMPO, FP, PRES, UTILIDAD)
      SELECT 
        ${cob_codigo} || (COALESCE(MAX(CAST(SUBSTR(TAR_CODIGO, LENGTH(${cob_codigo}) + 1) AS INTEGER)), 0) + 1),
        ${cli_codigo},
        ${tar_valor},
        ${tar_cuota},
        ${tar_fecha},
        ${tar_iten},
        'ACTIVA',
        ${tar_tiempo},
        ${tar_fp},
        ${tar_pres},
        ${tar_utilidad}
      FROM TARGETA 
      WHERE TAR_CODIGO LIKE ${cob_codigo} || '%'
    `,
  ]);
};

/// Crear abono Y reorganizar automáticamente el cobro
export const crearDescripcionAbonoSQL = async (
  tar_codigo: string,
  fecha_act: string,
  des_fecha: string,
  des_abono: string,
  des_resta: string,
) => {
  // Obtener el COB_CODIGO de esta tarjeta
  const tarjeta = await prisma.$queryRaw<{ COB_CODIGO: string }[]>`
    SELECT C.COB_CODIGO
    FROM TARGETA T
    INNER JOIN CLIENTES C ON T.CLI_CODIGO = C.CLI_CODIGO
    WHERE T.TAR_CODIGO = ${tar_codigo}
    LIMIT 1
  `;

  const cob_codigo = tarjeta[0]?.COB_CODIGO;

  if (!cob_codigo) {
    throw new Error("No se encontró el cobro asociado a esta tarjeta");
  }

  return await prisma.$transaction([
    // 1. Insertar el abono
    prisma.$executeRaw`
      INSERT INTO DESCRIPCION (TAR_CODIGO, FECHA_ACT, DES_FECHA, DES_ABONO, DES_RESTA)
      VALUES (${tar_codigo}, ${fecha_act}, ${des_fecha}, ${des_abono}, ${des_resta})
    `,

    // 2. Si DES_RESTA = 0, desactivar la TARJETA y poner ITEN = NULL
    prisma.$executeRaw`
      UPDATE TARGETA
      SET ESTADO = 'INACTIVA', ITEN = NULL
      WHERE TAR_CODIGO = ${tar_codigo}
        AND ${des_resta} = '0'
    `,

    // 3. Si DES_RESTA = 0, desactivar el CLIENTE asociado
    prisma.$executeRaw`
      UPDATE CLIENTES
      SET ESTADO = 'INACTIVO'
      WHERE CLI_CODIGO IN (
        SELECT CLI_CODIGO 
        FROM TARGETA 
        WHERE TAR_CODIGO = ${tar_codigo}
      )
      AND ${des_resta} = '0'
    `,

    // 4. RENUMERAR todas las tarjetas activas del cobro (solo si se pagó)
    // Crear tabla temporal con nuevos ITENs consecutivos
    prisma.$executeRaw`
      CREATE TEMP TABLE IF NOT EXISTS temp_iten_abono AS
      SELECT T.TAR_CODIGO, ROW_NUMBER() OVER (ORDER BY CAST(T.ITEN AS REAL)) as nuevo_iten
      FROM CLIENTES C
      INNER JOIN TARGETA T ON C.CLI_CODIGO = T.CLI_CODIGO
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
        WHERE rn = 1 AND tuvo_cero = 0
      ) D ON T.TAR_CODIGO = D.TAR_CODIGO
      WHERE T.ESTADO = 'ACTIVA'
        AND C.COB_CODIGO = ${cob_codigo}
        AND (D.TAR_CODIGO IS NOT NULL OR NOT EXISTS (
          SELECT 1 FROM DESCRIPCION D2 WHERE D2.TAR_CODIGO = T.TAR_CODIGO
        ))
    `,

    // 5. Actualizar ITENs con números consecutivos
    prisma.$executeRaw`
      UPDATE TARGETA
      SET ITEN = (SELECT nuevo_iten FROM temp_iten_abono WHERE temp_iten_abono.TAR_CODIGO = TARGETA.TAR_CODIGO)
      WHERE TAR_CODIGO IN (SELECT TAR_CODIGO FROM temp_iten_abono)
    `,

    // 6. Limpiar tabla temporal
    prisma.$executeRaw`
      DROP TABLE IF EXISTS temp_iten_abono
    `,
  ]);
};

// Crear el nuevo reporte del cobro al finalizar
export const crearReporteCobroSQL = async (
  cob_codigo: string,
  fecha: string,
  cobro: string,
  prestamo: string,
  utilidad: string,
  gastos: string,
  efectivo: string,
  base: string,
) => {
  try {
    const reporte = await prisma.$queryRaw<any[]>`
    INSERT INTO LISTADO (CODCOB, FECHA, COBRO, PRESTAMO, UTILIDAD, GASTOS, EFECTIVO, BASE)
    VALUES (
      ${cob_codigo}, ${fecha}, ${cobro}, ${prestamo}, ${utilidad}, ${gastos}, ${efectivo}, ${base}
    )
    `;
  } catch (error) {
    throw new Error(`Error al enviar reporte de cobro: ${error}`);
  }
};

// Reorganizar cobro: solo para casos donde quedaron tarjetas sin marcar
// (normalmente ya está todo organizado por crearDescripcionAbonoSQL)
