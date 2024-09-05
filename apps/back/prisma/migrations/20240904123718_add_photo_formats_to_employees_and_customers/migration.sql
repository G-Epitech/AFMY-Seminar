-- CreateEnum
CREATE TYPE "PhotoFormat" AS ENUM ('JPEG', 'PNG', 'GIF');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "photoFormat" "PhotoFormat";

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "photoFormat" "PhotoFormat";
