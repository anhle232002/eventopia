-- AlterTable
ALTER TABLE `Event` ADD COLUMN `city` VARCHAR(191) NULL DEFAULT 'Danang',
    ADD COLUMN `country` VARCHAR(191) NULL DEFAULT 'Vietnam',
    ADD COLUMN `is_cancelled` BOOLEAN NULL,
    ADD COLUMN `is_online_event` BOOLEAN NULL,
    ADD COLUMN `language` VARCHAR(191) NOT NULL DEFAULT 'en',
    ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `longtitude` DOUBLE NULL,
    ADD COLUMN `venue` VARCHAR(191) NULL DEFAULT 'online',
    MODIFY `location` VARCHAR(191) NULL DEFAULT '';

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_EventToTag` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_EventToTag_AB_unique`(`A`, `B`),
    INDEX `_EventToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_EventToTag` ADD CONSTRAINT `_EventToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EventToTag` ADD CONSTRAINT `_EventToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
