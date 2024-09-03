-- AlterTable
ALTER TABLE "Clothe" ALTER COLUMN "legacyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "legacyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "legacyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Encounter" ALTER COLUMN "legacyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "legacyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Payement" ALTER COLUMN "legacyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tip" ALTER COLUMN "legacyId" DROP NOT NULL;
