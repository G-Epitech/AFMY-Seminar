/*
  Warnings:

  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[legacyId]` on the table `Clothe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[legacyId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[legacyId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[legacyId]` on the table `Encounter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[legacyId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[legacyId]` on the table `Payement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[legacyId]` on the table `Tip` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `legacyId` to the `Clothe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `legacyId` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `legacyId` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `legacyId` to the `Encounter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `legacyId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `legacyId` to the `Payement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `legacyId` to the `Tip` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `B` on the `_EventAttendees` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_EventAttendees" DROP CONSTRAINT "_EventAttendees_B_fkey";

-- AlterTable
ALTER TABLE "Clothe" ADD COLUMN     "legacyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "legacyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "legacyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Encounter" ADD COLUMN     "legacyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
ADD COLUMN     "legacyId" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Payement" ADD COLUMN     "legacyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Tip" ADD COLUMN     "legacyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "_EventAttendees" DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Clothe_legacyId_key" ON "Clothe"("legacyId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_legacyId_key" ON "Customer"("legacyId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_legacyId_key" ON "Employee"("legacyId");

-- CreateIndex
CREATE UNIQUE INDEX "Encounter_legacyId_key" ON "Encounter"("legacyId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_legacyId_key" ON "Event"("legacyId");

-- CreateIndex
CREATE UNIQUE INDEX "Payement_legacyId_key" ON "Payement"("legacyId");

-- CreateIndex
CREATE UNIQUE INDEX "Tip_legacyId_key" ON "Tip"("legacyId");

-- CreateIndex
CREATE UNIQUE INDEX "_EventAttendees_AB_unique" ON "_EventAttendees"("A", "B");

-- CreateIndex
CREATE INDEX "_EventAttendees_B_index" ON "_EventAttendees"("B");

-- AddForeignKey
ALTER TABLE "_EventAttendees" ADD CONSTRAINT "_EventAttendees_B_fkey" FOREIGN KEY ("B") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
