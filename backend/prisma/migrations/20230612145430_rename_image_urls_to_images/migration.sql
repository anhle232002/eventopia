/*
  Warnings:

  - You are about to drop the column `image_urls` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Event` DROP COLUMN `image_urls`,
    ADD COLUMN `images` JSON NULL;
