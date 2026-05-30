"use client";

import { useState, useEffect, useMemo } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import {
  GRADE,
  SUBJECT,
  CLASS_WAY,
  CLASS_TYPE,
  CLASS_MAIN,
  calculateClassPeriod,
  calculateSalary,
  getWeekDay,
} from "@/lib/constants";
import { showToast } from "@/components/ui/Toast";

interface Student {
  id: string;
  name: string;
  grade: string;
}

interface RecordFormProps {
  initialData?: {
    id?: string;
    recordDate?: string;
    studentName?: string;
    studentGrade?: string;
    subject?: string;
    teacherName?: string;
    classTimeStart?: string;
    classTimeEnd?: string;
    classMain?: string;
    classWay?: string;
    classType?: string;
  };
  students: Student[];
  onSubmit: (data: Record<string, string>) => Promise<void>;
  onCancel: () => void;
}

export default function RecordForm({
  initialData,
  students,
  onSubmit,
  onCancel,
}: RecordFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recordDate: initialData?.recordDate || new Date().toISOString().split("T")[0],
    studentName: initialData?.studentName || "",
    studentGrade: initialData?.studentGrade || "",
    subject: initialData?.subject || "1",
    teacherName: initialData?.teacherName || "裴斐然",
    classTimeStart: initialData?.classTimeStart || "",
    classTimeEnd: initialData?.classTimeEnd || "",
    classMain: initialData?.classMain || "1",
    classWay: initialData?.classWay || "2",
    classType: initialData?.classType || "1",
  });

  // 自动填充星期
  const weekDay = useMemo(
    () => (formData.recordDate ? getWeekDay(formData.recordDate) : ""),
    [formData.recordDate]
  );

  // 自动计算课时和薪资
  const { classPeriod, salary } = useMemo(() => {
    if (formData.classTimeStart && formData.classTimeEnd && formData.studentGrade) {
      const period = calculateClassPeriod(
        formData.classTimeStart,
        formData.classTimeEnd
      );
      const sal = calculateSalary(formData.studentGrade, period);
      return { classPeriod: period, salary: sal };
    }
    return { classPeriod: 0, salary: 0 };
  }, [formData.classTimeStart, formData.classTimeEnd, formData.studentGrade]);

  // 选择学生时自动填充年级
  const handleStudentChange = (name: string) => {
    const student = students.find((s) => s.name === name);
    setFormData((prev) => ({
      ...prev,
      studentName: name,
      studentGrade: student?.grade || prev.studentGrade,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.studentName) {
      showToast("请选择学生", "error");
      return;
    }
    if (!formData.studentGrade) {
      showToast("请选择年级", "error");
      return;
    }
    if (!formData.classTimeStart || !formData.classTimeEnd) {
      showToast("请填写上课时间", "error");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        weekDay,
        classPeriod: String(classPeriod),
        salary: String(salary),
      });
    } finally {
      setLoading(false);
    }
  };

  // 获取去重的学生列表
  const studentNames = useMemo(
    () => [...new Set(students.map((s) => s.name))],
    [students]
  );

  return (
    <div className="space-y-4">
      {/* 日期 */}
      <Input
        label="上课日期"
        type="date"
        value={formData.recordDate}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, recordDate: e.target.value }))
        }
      />

      {/* 星期（只读） */}
      <Input label="星期" value={weekDay} readOnly />

      {/* 学生姓名 */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          学生姓名
        </label>
        <input
          list="student-list"
          className="w-full px-3 py-2.5 min-h-[44px] text-base border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          value={formData.studentName}
          onChange={(e) => handleStudentChange(e.target.value)}
          placeholder="输入或选择学生"
        />
        <datalist id="student-list">
          {studentNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </div>

      {/* 正课/试听 & 年级 & 科目 */}
      <div className="grid grid-cols-3 gap-3">
        <Select
          label="正课/试听"
          options={CLASS_MAIN}
          value={formData.classMain}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, classMain: e.target.value }))
          }
        />
        <Select
          label="年级"
          options={GRADE}
          value={formData.studentGrade}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, studentGrade: e.target.value }))
          }
        />
        <Select
          label="科目"
          options={SUBJECT}
          value={formData.subject}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, subject: e.target.value }))
          }
        />
      </div>

      {/* 授课老师 */}
      <Input
        label="授课老师"
        value={formData.teacherName}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, teacherName: e.target.value }))
        }
      />

      {/* 授课时间 */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="开始时间"
          type="time"
          value={formData.classTimeStart}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              classTimeStart: e.target.value,
            }))
          }
        />
        <Input
          label="结束时间"
          type="time"
          value={formData.classTimeEnd}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, classTimeEnd: e.target.value }))
          }
        />
      </div>

      {/* 课时和薪资预览 */}
      {classPeriod > 0 && (
        <div className="bg-teal-50 rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-600">课时: </span>
            <span className="text-lg font-bold text-teal-600">
              {classPeriod}h
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-600">预估薪资: </span>
            <span className="text-lg font-bold text-orange-600">
              ¥{salary}
            </span>
          </div>
        </div>
      )}

      {/* 上课方式 & 上课类型 */}
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="上课方式"
          options={CLASS_WAY}
          value={formData.classWay}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, classWay: e.target.value }))
          }
        />
        <Select
          label="上课类型"
          options={CLASS_TYPE}
          value={formData.classType}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, classType: e.target.value }))
          }
        />
      </div>

      {/* 按钮 */}
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" className="flex-1" onClick={onCancel}>
          取消
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          onClick={handleSubmit}
          loading={loading}
        >
          {initialData?.id ? "更新" : "保存"}
        </Button>
      </div>
    </div>
  );
}
