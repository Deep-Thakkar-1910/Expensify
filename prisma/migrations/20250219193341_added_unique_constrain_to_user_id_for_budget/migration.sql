/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `budget` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "budget_userId_key" ON "budget"("userId");
