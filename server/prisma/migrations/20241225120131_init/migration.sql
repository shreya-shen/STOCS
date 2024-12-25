/*
  Warnings:

  - You are about to drop the `ShopSatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ShopSatus";

-- CreateTable
CREATE TABLE "ShopStatus" (
    "isOpen" "openStatus" NOT NULL,

    CONSTRAINT "ShopStatus_pkey" PRIMARY KEY ("isOpen")
);
