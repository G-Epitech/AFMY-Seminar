/*
  Warnings:

  - A unique constraint covering the columns `[name,x,y]` on the table `Location` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Location_name_x_y_key" ON "Location"("name", "x", "y");
