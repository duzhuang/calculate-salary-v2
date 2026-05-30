"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import RecordItem from "./RecordItem";

interface Record {
  id: string;
  studentName: string;
  studentGrade: string;
  subject: string;
  classTimeStart: string;
  classTimeEnd: string;
  classPeriod: number;
  salary: number;
}

interface RecordCardProps {
  date: string;
  weekDay: string;
  totalPeriod: number;
  totalSalary: number;
  records: Record[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function RecordCard({
  date,
  weekDay,
  totalPeriod,
  totalSalary,
  records,
  onEdit,
  onDelete,
}: RecordCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">
            {date} {weekDay}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm text-gray-500">课时 </span>
            <span className="text-lg font-bold text-teal-600">
              {totalPeriod}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-500">金额 </span>
            <span className="text-lg font-bold text-orange-600">
              ¥{totalSalary}
            </span>
          </div>
        </div>
      </div>

      {/* Expand Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1 py-2 text-sm text-gray-500 hover:text-gray-700 border-t border-gray-100"
      >
        {expanded ? (
          <>
            收起记录 <ChevronUp className="w-4 h-4" />
          </>
        ) : (
          <>
            展开记录 <ChevronDown className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Records List */}
      {expanded && (
        <div className="px-4 pb-2">
          {records.map((record) => (
            <RecordItem
              key={record.id}
              record={record}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
