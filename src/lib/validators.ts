import { z } from "zod";

export const createRecordSchema = z.object({
  recordDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式不正确"),
  studentName: z.string().min(1, "学生姓名不能为空"),
  studentGrade: z.enum(
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    { message: "请选择年级" }
  ),
  subject: z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9"], {
    message: "请选择科目",
  }),
  teacherName: z.string().default("裴斐然"),
  classTimeStart: z.string().regex(/^\d{2}:\d{2}$/, "时间格式不正确"),
  classTimeEnd: z.string().regex(/^\d{2}:\d{2}$/, "时间格式不正确"),
  classMain: z.enum(["1", "2"]).default("1"),
  classWay: z.enum(["1", "2"]).default("2"),
  classType: z.enum(["1", "2", "3"]).default("1"),
});

export const updateRecordSchema = createRecordSchema.partial();

export const createStudentSchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  phone: z.string().optional(),
  grade: z.enum(
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    { message: "请选择年级" }
  ),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
