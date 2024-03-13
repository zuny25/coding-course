-- AlterTable
ALTER TABLE `users` ADD COLUMN `resetToekn` TEXT NULL,
    ADD COLUMN `reset_toekn_expiry` DATETIME(3) NULL;
