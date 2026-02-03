import type { Cliente } from './cliente';

export interface TarjetaConSaldo extends Cliente {
  // Campos de TARGETA
  TAR_CODIGO: string | null;
  TAR_VALOR: string;
  TAR_CUOTA: string;
  TAR_FECHA: string;
  ITEN: string;
  CLAVO: string;
  PRES: string;
  TIEMPO: string;
  FP: string;
  INT: string | null;
  
  // Campos de DESCRIPCION
  DES_RESTA: string | null;
  DES_FECHA: string | null;
  DES_ABONO: string | null;
  FECHA_ACT: string | null;

}