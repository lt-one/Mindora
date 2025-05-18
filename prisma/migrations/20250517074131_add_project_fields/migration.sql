/*
  Warnings:

  - You are about to drop the column `githubUrl` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categories` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `images` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailUrl` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `project` DROP COLUMN `githubUrl`,
    DROP COLUMN `imageUrl`,
    ADD COLUMN `categories` JSON NOT NULL,
    ADD COLUMN `challenges` JSON NULL,
    ADD COLUMN `client` VARCHAR(191) NULL,
    ADD COLUMN `completionDate` VARCHAR(191) NULL,
    ADD COLUMN `duration` VARCHAR(191) NULL,
    ADD COLUMN `featured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `highlightColor` VARCHAR(191) NULL,
    ADD COLUMN `images` JSON NOT NULL,
    ADD COLUMN `order` INTEGER NULL,
    ADD COLUMN `relatedPosts` JSON NULL,
    ADD COLUMN `relatedProjects` JSON NULL,
    ADD COLUMN `results` JSON NULL,
    ADD COLUMN `role` VARCHAR(191) NULL,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `solutions` JSON NULL,
    ADD COLUMN `sourceCodeUrl` VARCHAR(191) NULL,
    ADD COLUMN `summary` TEXT NOT NULL,
    ADD COLUMN `thumbnailUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `videoUrl` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Project_slug_key` ON `Project`(`slug`);

-- CreateIndex
CREATE INDEX `Project_slug_idx` ON `Project`(`slug`);
