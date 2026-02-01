import prisma from "../prisma/client";
import type { COBRO } from "@prisma/client";

export const getCobroSQL = () => {
  return prisma.$queryRaw<COBRO[]>`
    SELECT *
    FROM COBRO
  `;
};