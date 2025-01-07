/*
  Warnings:

  - You are about to drop the `Devolucion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Devolucion" DROP CONSTRAINT "Devolucion_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Devolucion" DROP CONSTRAINT "Devolucion_ventaId_fkey";

-- AlterTable
ALTER TABLE "Venta" ADD COLUMN     "devolucion" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "motivoDevolucion" TEXT;

-- DropTable
DROP TABLE "Devolucion";
