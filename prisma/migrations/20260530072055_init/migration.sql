-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "grade" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Record" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recordDate" TEXT NOT NULL,
    "weekDay" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentGrade" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "teacherName" TEXT NOT NULL DEFAULT '裴斐然',
    "classTimeStart" TEXT NOT NULL,
    "classTimeEnd" TEXT NOT NULL,
    "classPeriod" REAL NOT NULL,
    "classMain" TEXT NOT NULL DEFAULT '1',
    "classWay" TEXT NOT NULL DEFAULT '2',
    "classType" TEXT NOT NULL DEFAULT '1',
    "salary" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Record_studentName_studentGrade_fkey" FOREIGN KEY ("studentName", "studentGrade") REFERENCES "Student" ("name", "grade") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_name_grade_key" ON "Student"("name", "grade");
