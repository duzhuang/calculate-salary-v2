import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

// 年级价格表
const GRADE_PRICE: Record<string, number> = {
  "1": 110, "2": 110, "3": 110,
  "4": 120, "5": 120, "6": 120,
  "7": 130, "8": 140, "9": 150,
  "10": 160, "11": 170, "12": 180,
};

interface OldStudent {
  id: string;
  name: string;
  phone: string;
  grade: string;
}

interface OldRecord {
  id: string;
  recordDate: string;
  weekDay: string;
  classTime: { start: string; end: string };
  classPeriod: string;
  studentName: string;
  studentGrade: string;
  teacherName: string;
  subject: string;
  classWay: string;
  classType: string;
  classMain: string;
}

async function main() {
  // 读取原始数据
  const dbPath = join(
    process.env.HOME || "/Users/zhangdaxing",
    "Documents/Learn/React/calculate_salary/data/db.json"
  );
  const rawData = readFileSync(dbPath, "utf-8");
  const data = JSON.parse(rawData);

  const students: OldStudent[] = data.students;
  const records: OldRecord[] = data.records;

  console.log(`准备导入 ${students.length} 个学生，${records.length} 条记录`);

  // 清空现有数据
  await prisma.record.deleteMany();
  await prisma.student.deleteMany();
  console.log("已清空现有数据");

  // 收集所有记录中出现的学生（姓名+年级）
  const studentMap = new Map<string, string>(); // name -> grade

  // 先从学生表中获取
  for (const s of students) {
    studentMap.set(s.name, s.grade);
  }

  // 从记录中补充缺失的学生（用记录中的年级）
  for (const r of records) {
    if (!studentMap.has(r.studentName)) {
      studentMap.set(r.studentName, r.studentGrade);
    }
  }

  console.log(`共有 ${studentMap.size} 个唯一学生需要导入`);

  // 导入所有学生
  let studentCount = 0;
  for (const [name, grade] of studentMap) {
    try {
      await prisma.student.create({
        data: { name, grade, phone: null },
      });
      studentCount++;
    } catch (e) {
      console.warn(`跳过学生 ${name}: ${e}`);
    }
  }
  console.log(`成功导入 ${studentCount} 个学生`);

  // 导入记录
  let recordCount = 0;
  let skipCount = 0;
  for (const r of records) {
    try {
      const classPeriod = parseFloat(r.classPeriod) || 0;
      const price = GRADE_PRICE[r.studentGrade] || 0;
      const salary = Number((classPeriod * price).toFixed(2));

      await prisma.record.create({
        data: {
          recordDate: r.recordDate,
          weekDay: r.weekDay,
          studentName: r.studentName,
          studentGrade: r.studentGrade,
          subject: r.subject,
          teacherName: r.teacherName || "裴斐然",
          classTimeStart: r.classTime.start,
          classTimeEnd: r.classTime.end,
          classPeriod,
          classMain: r.classMain || "1",
          classWay: r.classWay || "2",
          classType: r.classType || "1",
          salary,
        },
      });
      recordCount++;
    } catch (e) {
      skipCount++;
      if (skipCount <= 5) {
        console.warn(`跳过记录 ${r.id} (${r.studentName} ${r.recordDate}): ${e}`);
      }
    }
  }
  console.log(`成功导入 ${recordCount} 条记录，跳过 ${skipCount} 条`);

  // 统计验证
  const totalStudents = await prisma.student.count();
  const totalRecords = await prisma.record.count();
  const totalSalary = await prisma.record.aggregate({ _sum: { salary: true } });

  console.log("\n=== 导入完成 ===");
  console.log(`学生总数: ${totalStudents}`);
  console.log(`记录总数: ${totalRecords}`);
  console.log(`薪资合计: ¥${totalSalary._sum.salary?.toFixed(2)}`);
}

main()
  .catch((e) => {
    console.error("导入失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
