import prisma from "../prisma/client";

// Obtener todos los códigos de cobro
export const obtenerTodosLosCobrosSQL = () => {
  return prisma.$queryRaw<{ COB_CODIGO: string }[]>`
    SELECT DISTINCT COB_CODIGO
    FROM COBRO
    ORDER BY COB_CODIGO
  `;
};

// Paso 1: Crear columnas si no existen
export const crearColumnasMantenimientoSQL = async () => {
  try {
    await prisma.$executeRaw`ALTER TABLE TARGETA ADD COLUMN PRES REAL`;
  } catch (error) {
    // Columna ya existe
  }
  
  try {
    await prisma.$executeRaw`ALTER TABLE TARGETA ADD COLUMN UTILIDAD INTEGER`;
  } catch (error) {
    // Columna ya existe
  }
};

// Paso 2: Actualizar PRES para tarjetas sin valor válido
export const actualizarPresSQL = async () => {
  return await prisma.$executeRaw`
    UPDATE TARGETA 
    SET PRES = CAST(ROUND(CAST(TAR_VALOR AS REAL) / 1.20, 0) AS INTEGER)
    WHERE PRES IS NULL 
       OR PRES = '' 
       OR PRES = '1' 
       OR CAST(PRES AS REAL) < 1000
  `;
};

// Paso 3: Actualizar UTILIDAD
export const actualizarUtilidadSQL = async () => {
  return await prisma.$executeRaw`
    UPDATE TARGETA 
    SET UTILIDAD = CAST(TAR_VALOR AS INTEGER) - CAST(PRES AS INTEGER)
    WHERE PRES IS NOT NULL AND (UTILIDAD IS NULL OR UTILIDAD = 0)
  `;
};

// Paso 4: Marcar tarjetas pagadas como INACTIVAS
export const marcarTarjetasInactivasSQL = async () => {
  return await prisma.$executeRaw`
    UPDATE TARGETA
    SET ESTADO = 'INACTIVA', ITEN = NULL
    WHERE TAR_CODIGO IN (
        SELECT T.TAR_CODIGO
        FROM TARGETA T
        INNER JOIN CLIENTES C ON T.CLI_CODIGO = C.CLI_CODIGO
        WHERE T.ESTADO = 'ACTIVA'
        AND T.TAR_CODIGO NOT IN (
            -- Tarjetas que SÍ deben estar activas
            SELECT T2.TAR_CODIGO
            FROM CLIENTES C2
            INNER JOIN TARGETA T2 ON C2.CLI_CODIGO = T2.CLI_CODIGO
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
            ) D ON T2.TAR_CODIGO = D.TAR_CODIGO
            WHERE T2.ESTADO = 'ACTIVA'
              AND (D.TAR_CODIGO IS NOT NULL OR NOT EXISTS (
                    SELECT 1 FROM DESCRIPCION D2 WHERE D2.TAR_CODIGO = T2.TAR_CODIGO
                  ))
        )
    )
  `;
};

// Paso 5: Marcar clientes como INACTIVOS
export const marcarClientesInactivosSQL = async () => {
  return await prisma.$executeRaw`
    UPDATE CLIENTES
    SET ESTADO = 'INACTIVO'
    WHERE CLI_CODIGO IN (
        SELECT T.CLI_CODIGO
        FROM TARGETA T
        WHERE T.ESTADO = 'INACTIVA'
          AND NOT EXISTS (
            SELECT 1 FROM TARGETA T2 
            WHERE T2.CLI_CODIGO = T.CLI_CODIGO 
            AND T2.ESTADO = 'ACTIVA'
          )
    )
  `;
};

// Paso 6: Renumerar ITENs por cobro específico
export const renumerarItensPorCobroSQL = async (cob_codigo: string) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Eliminar tabla temporal si existe
    try {
      await tx.$executeRaw`DROP TABLE IF EXISTS temp_iten_mantenimiento`;
    } catch (error) {
      // Ignorar si no existe
    }
    
    // 2. Crear tabla temporal con ITENs consecutivos
    await tx.$executeRaw`
      CREATE TEMP TABLE temp_iten_mantenimiento AS
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
    `;
    
    // 3. Actualizar ITENs
    await tx.$executeRaw`
      UPDATE TARGETA
      SET ITEN = (
        SELECT nuevo_iten 
        FROM temp_iten_mantenimiento 
        WHERE temp_iten_mantenimiento.TAR_CODIGO = TARGETA.TAR_CODIGO
      )
      WHERE TAR_CODIGO IN (SELECT TAR_CODIGO FROM temp_iten_mantenimiento)
    `;
    
    // 4. Limpiar tabla temporal
    try {
      await tx.$executeRaw`DROP TABLE IF EXISTS temp_iten_mantenimiento`;
    } catch (error) {
      // Ignorar
    }
  });
};