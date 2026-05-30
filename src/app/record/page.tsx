"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import RecordForm from "@/components/record/RecordForm";
import { showToast } from "@/components/ui/Toast";

interface Student {
  id: string;
  name: string;
  grade: string;
}

export default function AddRecordPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data || []))
      .catch(console.error);
  }, []);

  const handleSubmit = async (data: Record<string, string>) => {
    const res = await fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recordDate: data.recordDate,
        studentName: data.studentName,
        studentGrade: data.studentGrade,
        subject: data.subject,
        teacherName: data.teacherName,
        classTimeStart: data.classTimeStart,
        classTimeEnd: data.classTimeEnd,
        classMain: data.classMain,
        classWay: data.classWay,
        classType: data.classType,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "保存失败");
    }

    showToast("记录已保存");
    router.push("/");
  };

  return (
    <div>
      <Header title="添加记录" showBack />
      <div className="px-4 py-4 max-w-lg mx-auto">
        <RecordForm
          students={students}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
