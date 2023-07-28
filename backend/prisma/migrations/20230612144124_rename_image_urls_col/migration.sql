/*
  Warnings:

  - You are about to drop the column `image_url` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Event` DROP COLUMN `image_url`,
    ADD COLUMN `image_urls` JSON NULL;
