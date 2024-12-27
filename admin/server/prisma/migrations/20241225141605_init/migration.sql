/*
  Warnings:

  - You are about to drop the column `Price` on the `OrderDetails` table. All the data in the column will be lost.
  - Added the required column `price` to the `OrderDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderDetails" DROP COLUMN "Price",
ADD COLUMN     "price" INTEGER NOT NULL;
