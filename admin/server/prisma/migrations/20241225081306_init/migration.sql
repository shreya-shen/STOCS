/*
  Warnings:

  - You are about to drop the column `price` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Products` table. All the data in the column will be lost.
  - Added the required column `category` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `USN` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Pending', 'Completed');

-- CreateEnum
CREATE TYPE "openStatus" AS ENUM ('Open', 'Closed');

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "price",
DROP COLUMN "rating",
ADD COLUMN     "category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "USN" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Orders" (
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "placedAt" TIMESTAMP(3) NOT NULL,
    "TotalPrice" INTEGER NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "OrderDetails" (
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "Price" INTEGER NOT NULL,

    CONSTRAINT "OrderDetails_pkey" PRIMARY KEY ("orderId","productId")
);

-- CreateTable
CREATE TABLE "ShopSatus" (
    "isOpen" "openStatus" NOT NULL,

    CONSTRAINT "ShopSatus_pkey" PRIMARY KEY ("isOpen")
);

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
