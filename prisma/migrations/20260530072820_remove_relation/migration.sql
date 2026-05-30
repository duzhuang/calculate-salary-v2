-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Record" (
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
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Record" ("classMain", "classPeriod", "classTimeEnd", "classTimeStart", "classType", "classWay", "createdAt", "id", "recordDate", "salary", "studentGrade", "studentName", "subject", "teacherName", "updatedAt", "weekDay") SELECT "classMain", "classPeriod", "classTimeEnd", "classTimeStart", "classType", "classWay", "createdAt", "id", "recordDate", "salary", "studentGrade", "studentName", "subject", "teacherName", "updatedAt", "weekDay" FROM "Record";
DROP TABLE "Record";
ALTER TABLE "new_Record" RENAME TO "Record";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
