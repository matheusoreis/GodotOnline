/*
  Warnings:

  - You are about to drop the column `genderId` on the `Characters` table. All the data in the column will be lost.
  - You are about to drop the column `worldId` on the `Characters` table. All the data in the column will be lost.
  - Added the required column `gendersId` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `worldsId` to the `Characters` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Characters" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "direction" INTEGER NOT NULL DEFAULT 1,
    "positionX" INTEGER NOT NULL DEFAULT 32,
    "positionY" INTEGER NOT NULL DEFAULT 32,
    "sprite" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "gendersId" INTEGER NOT NULL,
    "worldsId" INTEGER NOT NULL,
    "accountsId" INTEGER,
    CONSTRAINT "Characters_gendersId_fkey" FOREIGN KEY ("gendersId") REFERENCES "Genders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Characters_worldsId_fkey" FOREIGN KEY ("worldsId") REFERENCES "Worlds" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Characters_accountsId_fkey" FOREIGN KEY ("accountsId") REFERENCES "Accounts" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Characters" ("accountsId", "createdAt", "direction", "id", "name", "positionX", "positionY", "sprite", "updatedAt") SELECT "accountsId", "createdAt", "direction", "id", "name", "positionX", "positionY", "sprite", "updatedAt" FROM "Characters";
DROP TABLE "Characters";
ALTER TABLE "new_Characters" RENAME TO "Characters";
CREATE UNIQUE INDEX "Characters_name_key" ON "Characters"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
