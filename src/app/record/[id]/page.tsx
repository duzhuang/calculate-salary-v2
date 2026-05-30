"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/ui/Header";
import RecordForm from "@/components/record/RecordForm";
import { showToast } from "@/components/ui/Toast";

interface Student {
  id: string;
  name: string;
  grade: string;
}

interface RecordData {
  id: string;
  recordDate: string;
  studentName: string;
  studentGrade: string;
  subject: string;
  teacherName: string;
  classTimeStart: string;
  classTimeEnd: string;
  classMain: string;
  classWay: string;
  classType: string;
}

export default function EditRecordPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [students, setStudents] = useState<Student[]>([]);
  const [record, setRecord] = useState<RecordData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/students").then((res) => res.json()),
      fetch(`/api/records/${id}`).then((res) => res.json()),
    ])
      .then(([studentsData, recordData]) => {
        setStudents(studentsData || []);
        setRecord(recordData);
      })
      .catch((error) => {
        console.error("获取数据失败:", error);
        showToast("获取数据失败", "error");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: Record<string, string>) => {
    const res = await fetch(`/api/records/${id}`, {
      method: "PUT",
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
      throw new Error(error.error || "更新失败");
    }

    showToast("记录已更新");
    router.push("/");
  };

  if (loading) {
    return (
      <div>
        <Header title="编辑记录" showBack />
        <div className="px-4 py-4 max-w-lg mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div>
        <Header title="编辑记录" showBack />
        <div className="px-4 py-4 text-center text-gray-500">记录不存在</div>
      </div>
    );
  }

  return (
    <div>
      <Header title="编辑记录" showBack />
      <div className="px-4 py-4 max-w-lg mx-auto">
        <RecordForm
          initialData={record}
          students={students}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
