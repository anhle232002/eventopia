-- AlterTable
ALTER TABLE `Ticket` ADD COLUMN `promoId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Promo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `valid_from` DATETIME(3) NOT NULL,
    `valid_until` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `organizerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Promo_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promoOnEvent` (
    `promoId` INTEGER NOT NULL,
    `eventId` INTEGER NOT NULL,

    PRIMARY KEY (`promoId`, `eventId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promoOnOrganizer` (
    `promoId` INTEGER NOT NULL,
    `organizerId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`promoId`, `organizerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_promoId_fkey` FOREIGN KEY (`promoId`) REFERENCES `Promo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Promo` ADD CONSTRAINT `Promo_organizerId_fkey` FOREIGN KEY (`organizerId`) REFERENCES `Organizer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promoOnEvent` ADD CONSTRAINT `promoOnEvent_promoId_fkey` FOREIGN KEY (`promoId`) REFERENCES `Promo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promoOnEvent` ADD CONSTRAINT `promoOnEvent_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promoOnOrganizer` ADD CONSTRAINT `promoOnOrganizer_promoId_fkey` FOREIGN KEY (`promoId`) REFERENCES `Promo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promoOnOrganizer` ADD CONSTRAINT `promoOnOrganizer_organizerId_fkey` FOREIGN KEY (`organizerId`) REFERENCES `Organizer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
