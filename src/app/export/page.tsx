"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { Download } from "lucide-react";

export default function ExportPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!startDate || !endDate) {
      showToast("请选择日期范围", "error");
      return;
    }

    if (startDate > endDate) {
      showToast("开始日期不能大于结束日期", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/export?startDate=${startDate}&endDate=${endDate}`
      );

      if (!res.ok) {
        const error = await res.json();
        showToast(error.error || "导出失败", "error");
        return;
      }

      const data = await res.json();

      if (data.length === 0) {
        showToast("该日期范围内没有记录", "info");
        return;
      }

      // 动态导入 xlsx 和 file-saver
      const XLSX = await import("xlsx");
      const { saveAs } = await import("file-saver");

      // 创建工作表
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "薪水表");

      // 生成文件
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });

      saveAs(blob, `薪资记录_${startDate}_${endDate}.xlsx`);
      showToast(`已导出 ${data.length} 条记录`);
    } catch (error) {
      console.error("导出失败:", error);
      showToast("导出失败", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="导出 Excel" showBack />

      <div className="px-4 py-4 max-w-lg mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-4">
          <Input
            label="开始日期"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <Input
            label="结束日期"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <Button
            variant="primary"
            className="w-full"
            onClick={handleExport}
            loading={loading}
          >
            <Download className="w-4 h-4 mr-2" />
            导出 Excel
          </Button>
        </div>
      </div>
    </div>
  );
}
