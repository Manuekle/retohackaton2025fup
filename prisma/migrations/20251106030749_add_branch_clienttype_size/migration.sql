/*
  Warnings:

  - You are about to drop the column `productId` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `Sale` table. All the data in the column will be lost.

*/

-- Step 1: Add updatedAt columns with default values first
ALTER TABLE "Branch" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Branch" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Category" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Category" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "ClientType" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "ClientType" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Step 2: Add price and updatedAt to Product with default values
ALTER TABLE "Product" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Product" ADD COLUMN "description" TEXT;
ALTER TABLE "Product" ADD COLUMN "price" DOUBLE PRECISION DEFAULT 50;
ALTER TABLE "Product" ADD COLUMN "stock" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Product" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing products with default price
UPDATE "Product" SET "price" = 50 WHERE "price" IS NULL;

-- Make price required now that all rows have values
ALTER TABLE "Product" ALTER COLUMN "price" SET NOT NULL;
ALTER TABLE "Product" ALTER COLUMN "price" DROP DEFAULT;

-- Step 3: Create Customer table first (needed for Sale migration)
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "clientTypeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- Step 4: Create SaleItem table first so we can migrate data
CREATE TABLE "SaleItem" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "size" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id")
);

-- Step 5: Migrate data from Sale to SaleItem before dropping columns
-- Use a simple approach: concatenate sale ID with a unique identifier
INSERT INTO "SaleItem" ("id", "saleId", "productId", "quantity", "price", "size", "createdAt", "updatedAt")
SELECT 
    "id" || '_item' as "id",
    "id" as "saleId",
    "productId",
    COALESCE("quantity", 1),
    COALESCE("unitPrice", 0),
    "size",
    COALESCE("date", CURRENT_TIMESTAMP),
    CURRENT_TIMESTAMP
FROM "Sale"
WHERE "productId" IS NOT NULL;

-- Step 6: Add new columns to Sale with default values
ALTER TABLE "Sale" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Sale" ADD COLUMN "customerId" TEXT;
ALTER TABLE "Sale" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'completed';
ALTER TABLE "Sale" ADD COLUMN "total" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE "Sale" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing sales with total from totalPrice
UPDATE "Sale" SET "total" = COALESCE("totalPrice", 0);

-- Make total required now that all rows have values
ALTER TABLE "Sale" ALTER COLUMN "total" SET NOT NULL;
ALTER TABLE "Sale" ALTER COLUMN "total" DROP DEFAULT;

-- Step 7: Update date column default if needed
ALTER TABLE "Sale" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Sale" ALTER COLUMN "branchId" DROP NOT NULL;
ALTER TABLE "Sale" ALTER COLUMN "clientTypeId" DROP NOT NULL;

-- Step 8: Drop foreign keys temporarily
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_branchId_fkey";
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_clientTypeId_fkey";
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_productId_fkey";

-- Step 9: Drop old indexes
DROP INDEX "Product_name_key";

-- Step 10: Make categoryId nullable
ALTER TABLE "Product" ALTER COLUMN "categoryId" DROP NOT NULL;

-- Step 11: Drop old columns from Sale (data already migrated)
ALTER TABLE "Sale" DROP COLUMN "productId";
ALTER TABLE "Sale" DROP COLUMN "quantity";
ALTER TABLE "Sale" DROP COLUMN "size";
ALTER TABLE "Sale" DROP COLUMN "totalPrice";
ALTER TABLE "Sale" DROP COLUMN "unitPrice";

-- Step 12: Re-add foreign keys
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Customer" ADD CONSTRAINT "Customer_clientTypeId_fkey" FOREIGN KEY ("clientTypeId") REFERENCES "ClientType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Sale" ADD CONSTRAINT "Sale_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Sale" ADD CONSTRAINT "Sale_clientTypeId_fkey" FOREIGN KEY ("clientTypeId") REFERENCES "ClientType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Sale" ADD CONSTRAINT "Sale_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
