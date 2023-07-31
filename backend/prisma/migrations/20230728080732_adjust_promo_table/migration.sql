/*
  Warnings:

  - Added the required column `discount` to the `Promo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Promo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Promo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Promo` ADD COLUMN `discount` DOUBLE NOT NULL,
    ADD COLUMN `total` INTEGER NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    ADD COLUMN `used` INTEGER NOT NULL DEFAULT 0;
