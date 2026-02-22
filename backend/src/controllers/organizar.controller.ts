import { Request, Response } from "express";
import {
  obtenerTodosLosCobrosSQL,
  crearColumnasMantenimientoSQL,
  actualizarPresSQL,
  actualizarUtilidadSQL,
  marcarTarjetasInactivasSQL,
  marcarClientesInactivosSQL,
  renumerarItensPorCobroSQL,
} from "../sql/organizar.sql";

export const ejecutarMantenimientoCompleto = async (req: Request, res: Response) => {
  try {
    console.log('🔧 [MANTENIMIENTO] Iniciando...');
    
    // PASO 1: Obtener todos los cobros de la BD
    console.log('📋 [MANTENIMIENTO] Buscando cobros...');
    const cobros = await obtenerTodosLosCobrosSQL();
    
    if (cobros.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se encontraron cobros en la base de datos'
      });
    }
    
    console.log(`✓ [MANTENIMIENTO] Encontrados ${cobros.length} cobro(s): ${cobros.map(c => c.COB_CODIGO).join(', ')}`);
    
    // PASO 2: Mantenimiento general
    console.log('⚙️ [MANTENIMIENTO] Ejecutando mantenimiento general...');
    
    // 2.1 Crear columnas
    console.log('  → Creando columnas PRES y UTILIDAD si no existen...');
    await crearColumnasMantenimientoSQL();
    
    // 2.2 Actualizar PRES
    console.log('  → Actualizando valores de PRES...');
    const presActualizados = await actualizarPresSQL();
    console.log(`    ✓ ${presActualizados} registro(s) actualizados`);
    
    // 2.3 Actualizar UTILIDAD
    console.log('  → Calculando UTILIDAD...');
    const utilidadesActualizadas = await actualizarUtilidadSQL();
    console.log(`    ✓ ${utilidadesActualizadas} registro(s) actualizados`);
    
    // 2.4 Marcar tarjetas pagadas como INACTIVAS
    console.log('  → Marcando tarjetas pagadas como INACTIVAS...');
    const tarjetasInactivas = await marcarTarjetasInactivasSQL();
    console.log(`    ✓ ${tarjetasInactivas} tarjeta(s) marcadas como INACTIVAS`);
    
    // 2.5 Marcar clientes sin tarjetas activas como INACTIVOS
    console.log('  → Marcando clientes como INACTIVOS...');
    const clientesInactivos = await marcarClientesInactivosSQL();
    console.log(`    ✓ ${clientesInactivos} cliente(s) marcados como INACTIVOS`);
    
    // PASO 3: Renumerar ITENs por cada cobro
    console.log('🔢 [MANTENIMIENTO] Renumerando ITENs por cobro...');
    
    for (let i = 0; i < cobros.length; i++) {
      const cobro = cobros[i];
      console.log(`  → [${i + 1}/${cobros.length}] Procesando: ${cobro.COB_CODIGO}`);
      
      try {
        await renumerarItensPorCobroSQL(cobro.COB_CODIGO);
        console.log(`    ✓ Completado`);
      } catch (error: any) {
        console.error(`    ✗ Error: ${error.message}`);
        // Continuar con el siguiente cobro
      }
    }
    
    // FINALIZACIÓN
    console.log('✅ [MANTENIMIENTO] Completado exitosamente');
    
    return res.status(200).json({
      success: true,
      message: `Mantenimiento completado exitosamente para ${cobros.length} cobro(s)`,
      cobros_procesados: cobros.map(c => c.COB_CODIGO),
      estadisticas: {
        total_cobros: cobros.length,
        pres_actualizados: presActualizados,
        utilidades_actualizadas: utilidadesActualizadas,
        tarjetas_inactivadas: tarjetasInactivas,
        clientes_inactivados: clientesInactivos,
      }
    });
    
  } catch (error: any) {
    console.error('❌ [MANTENIMIENTO] Error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Error al ejecutar mantenimiento',
      details: error.message
    });
  }
};