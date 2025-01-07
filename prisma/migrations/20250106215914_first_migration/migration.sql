/*
  Warnings:

  - Added the required column `apellido_materno` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apellido_paterno` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "apellido_materno" TEXT NOT NULL,
ADD COLUMN     "apellido_paterno" TEXT NOT NULL;
