/*
  Warnings:

  - Added the required column `customer_email` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Ticket` DROP FOREIGN KEY `Ticket_user_id_fkey`;

-- AlterTable
ALTER TABLE `Ticket` ADD COLUMN `customer_email` VARCHAR(191) NOT NULL,
    MODIFY `user_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
