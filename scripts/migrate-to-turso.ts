/**
 * 一次性迁移脚本：将本地 SQLite 数据迁移到 Turso
 *
 * 使用方法：
 * 1. 先在 .env 中配置 TURSO_DATABASE_URL 和 TURSO_AUTH_TOKEN
 * 2. 确保本地 SQLite 数据库有数据
 * 3. 运行：npx tsx scripts/migrate-to-turso.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// 本地 SQLite client（读取数据）
const localPrisma = new PrismaClient();

// Turso client（写入数据）
function createTursoClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error("错误：请在 .env 中配置 TURSO_DATABASE_URL 和 TURSO_AUTH_TOKEN");
    process.exit(1);
  }

  const adapter = new PrismaLibSql({ url, authToken });
  return new PrismaClient({ adapter });
}

async function main() {
  const tursoPrisma = createTursoClient();

  console.log("=== 开始迁移数据到 Turso ===\n");

  // 1. 读取本地数据
  const students = await localPrisma.student.findMany();
  const records = await localPrisma.record.findMany();

  console.log(`本地数据：${students.length} 个学生，${records.length} 条记录\n`);

  // 2. 清空 Turso 数据库
  console.log("清空 Turso 数据库...");
  await tursoPrisma.record.deleteMany();
  await tursoPrisma.student.deleteMany();

  // 3. 迁移学生数据
  console.log("迁移学生数据...");
  let studentCount = 0;
  for (const s of students) {
    try {
      await tursoPrisma.student.create({
        data: {
          id: s.id,
          name: s.name,
          phone: s.phone,
          grade: s.grade,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        },
      });
      studentCount++;
    } catch (e) {
      console.warn(`跳过学生 ${s.name}: ${e}`);
    }
  }
  console.log(`成功迁移 ${studentCount}/${students.length} 个学生`);

  // 4. 迁移记录数据
  console.log("迁移记录数据...");
  let recordCount = 0;
  let skipCount = 0;
  for (const r of records) {
    try {
      await tursoPrisma.record.create({
        data: {
          id: r.id,
          recordDate: r.recordDate,
          weekDay: r.weekDay,
          studentName: r.studentName,
          studentGrade: r.studentGrade,
          subject: r.subject,
          teacherName: r.teacherName,
          classTimeStart: r.classTimeStart,
          classTimeEnd: r.classTimeEnd,
          classPeriod: r.classPeriod,
          classMain: r.classMain,
          classWay: r.classWay,
          classType: r.classType,
          salary: r.salary,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        },
      });
      recordCount++;
    } catch (e) {
      skipCount++;
      if (skipCount <= 5) {
        console.warn(`跳过记录 ${r.id}: ${e}`);
      }
    }
  }
  console.log(`成功迁移 ${recordCount}/${records.length} 条记录，跳过 ${skipCount} 条`);

  // 5. 验证
  const totalStudents = await tursoPrisma.student.count();
  const totalRecords = await tursoPrisma.record.count();
  const totalSalary = await tursoPrisma.record.aggregate({ _sum: { salary: true } });

  console.log("\n=== 迁移完成 ===");
  console.log(`Turso 学生总数: ${totalStudents}`);
  console.log(`Turso 记录总数: ${totalRecords}`);
  console.log(`Turso 薪资合计: ¥${totalSalary._sum.salary?.toFixed(2)}`);

  await tursoPrisma.$disconnect();
}

main()
  .catch((e) => {
    console.error("迁移失败:", e);
    process.exit(1);
  })
  .finally(() => localPrisma.$disconnect());
