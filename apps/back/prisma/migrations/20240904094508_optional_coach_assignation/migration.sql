-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_coachId_fkey";

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "coachId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
