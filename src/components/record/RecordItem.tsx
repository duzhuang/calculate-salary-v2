"use client";

import { GRADE, SUBJECT, GRADE_PRICE } from "@/lib/constants";
import { Pencil, Trash2 } from "lucide-react";

interface RecordItemProps {
  record: {
    id: string;
    studentName: string;
    studentGrade: string;
    subject: string;
    classTimeStart: string;
    classTimeEnd: string;
    classPeriod: number;
    salary: number;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function RecordItem({
  record,
  onEdit,
  onDelete,
}: RecordItemProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-900 truncate">
            {record.studentName}
          </span>
          <span className="text-sm text-gray-500">
            {GRADE[record.studentGrade]}
          </span>
          <span className="text-sm text-gray-500">
            {SUBJECT[record.subject]}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>
            {record.classTimeStart}-{record.classTimeEnd}
          </span>
          <span className="text-teal-600 font-medium">
            {record.classPeriod}课时
          </span>
          <span className="text-orange-600 font-semibold">
            ¥{record.salary}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 ml-2">
        <button
          onClick={() => onEdit(record.id)}
          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-teal-600"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(record.id)}
          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
