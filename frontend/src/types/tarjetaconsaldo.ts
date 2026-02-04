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
  INT: string | null

}