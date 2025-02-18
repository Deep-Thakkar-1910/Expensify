/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `user_account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_account_name_key" ON "user_account"("name");
