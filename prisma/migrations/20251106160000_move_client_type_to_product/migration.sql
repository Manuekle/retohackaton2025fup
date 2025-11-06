-- AlterTable
ALTER TABLE "Product" ADD COLUMN "clientTypeId" TEXT;

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "clientTypeId";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_clientTypeId_fkey" FOREIGN KEY ("clientTypeId") REFERENCES "ClientType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

