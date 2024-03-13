/*
  Warnings:

  - You are about to drop the column `resetToekn` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `resetToekn`,
    ADD COLUMN `reset_token` TEXT NULL;
