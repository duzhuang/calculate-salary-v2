"use client";

import { useState, useCallback, useRef } from "react";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { Upload, FileSpreadsheet, X, CheckCircle, XCircle } from "lucide-react";

// 字段映射配置
const MAPPING_CONFIG: Record<string, string> = {
  日期: "recordDate",
  星期几: "weekDay",
  姓名: "studentName",
  "正课/试听": "classMain",
  年级: "studentGrade",
  科目: "subject",
  授课教师: "teacherName",
  授课时间: "classTime",
  课时: "classPeriod",
  上课方式: "classWay",
  上课类型: "classType",
};

const GRADE_MAP: Record<string, string> = {
  一年级: "1",
  二年级: "2",
  三年级: "3",
  四年级: "4",
  五年级: "5",
  六年级: "6",
  七年级: "7",
  八年级: "8",
  九年级: "9",
  初一: "7",
  初二: "8",
  初三: "9",
  高一: "10",
  高二: "11",
  高三: "12",
};

export default function ImportPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [result, setResult] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // 验证文件类型
      if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
        showToast("请选择 Excel 或 CSV 文件", "error");
        return;
      }

      // 验证文件大小
      if (file.size > 10 * 1024 * 1024) {
        showToast("文件大小不能超过 10MB", "error");
        return;
      }

      setFileName(file.name);
      setResult(null);
      setIsLoading(true);

      try {
        const XLSX = await import("xlsx");

        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: "",
        }) as string[][];

        if (rawData.length < 2) {
          showToast("文件为空或格式不正确", "error");
          return;
        }

        const headers = rawData[0];
        const rows = rawData.slice(1).filter((row) =>
          row.some((cell) => cell !== "" && cell != null)
        );

        // 验证表头
        const requiredHeaders = ["日期", "姓名", "年级"];
        const missing = requiredHeaders.filter((h) => !headers.includes(h));
        if (missing.length > 0) {
          showToast(`缺少必要的表头: ${missing.join(", ")}`, "error");
          return;
        }

        // 转换数据
        let success = 0;
        let failed = 0;
        const errors: string[] = [];

        setProgress({ current: 0, total: rows.length });

        for (let i = 0; i < rows.length; i++) {
          try {
            const row = rows[i];
            const mapped: Record<string, string> = {};

            headers.forEach((header, colIndex) => {
              const field = MAPPING_CONFIG[header];
              if (field && row[colIndex] !== undefined) {
                mapped[field] = String(row[colIndex]).trim();
              }
            });

            // 转换日期格式
            if (mapped.recordDate) {
              const parts = mapped.recordDate.split(".");
              if (parts.length === 2) {
                const year = new Date().getFullYear();
                mapped.recordDate = `${year}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`;
              }
            }

            // 转换年级
            if (mapped.studentGrade) {
              mapped.studentGrade =
                GRADE_MAP[mapped.studentGrade] || mapped.studentGrade;
            }

            // 转换时间
            if (mapped.classTime) {
              const [start, end] = mapped.classTime.split("-");
              if (start && end) {
                mapped.classTimeStart = start.trim();
                mapped.classTimeEnd = end.trim();
              }
              delete mapped.classTime;
            }

            // 转换正课/试听
            if (mapped.classMain === "正课") mapped.classMain = "1";
            else if (mapped.classMain === "试听") mapped.classMain = "2";

            // 转换上课方式
            if (mapped.classWay === "线下") mapped.classWay = "2";
            else if (mapped.classWay === "线上") mapped.classWay = "1";

            // 转换上课类型
            if (mapped.classType === "1对1" || mapped.classType === "一对一")
              mapped.classType = "1";
            else if (mapped.classType === "小班") mapped.classType = "2";
            else if (mapped.classType === "大班") mapped.classType = "3";

            // 设置默认值
            mapped.teacherName = mapped.teacherName || "裴斐然";
            mapped.classMain = mapped.classMain || "1";
            mapped.classWay = mapped.classWay || "2";
            mapped.classType = mapped.classType || "1";
            mapped.subject = mapped.subject || "1";

            const res = await fetch("/api/records", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(mapped),
            });

            if (res.ok) {
              success++;
            } else {
              failed++;
              errors.push(`第${i + 2}行: 导入失败`);
            }
          } catch (error) {
            failed++;
            errors.push(`第${i + 2}行: 数据格式错误`);
          }

          setProgress({ current: i + 1, total: rows.length });

          // 添加小延迟避免请求过快
          if (i < rows.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        }

        setResult({ success, failed, errors });
        showToast(`导入完成: 成功${success}条，失败${failed}条`);
      } catch (error) {
        console.error("导入失败:", error);
        showToast("文件解析失败", "error");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const resetImport = () => {
    setFileName("");
    setProgress({ current: 0, total: 0 });
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <Header title="导入 Excel" showBack />

      <div className="px-4 py-4 max-w-lg mx-auto">
        {/* 上传区域 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <input
            ref={fileInputRef}
            type="file"
            id="excel-file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileSelect}
            className="hidden"
          />

          <label
            htmlFor="excel-file"
            className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 transition-colors"
          >
            {isLoading ? (
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-3" />
                <div className="text-gray-600">处理中...</div>
                {progress.total > 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    {progress.current} / {progress.total}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <div className="text-gray-600 mb-1">
                  {fileName || "点击选择文件或拖拽到此处"}
                </div>
                <div className="text-sm text-gray-400">
                  支持 .xlsx, .xls, .csv 格式
                </div>
              </div>
            )}
          </label>
        </div>

        {/* 进度条 */}
        {isLoading && progress.total > 0 && (
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-600 transition-all duration-200"
                style={{
                  width: `${(progress.current / progress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* 导入结果 */}
        {result && (
          <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h3 className="font-medium text-gray-900 mb-3">导入结果</h3>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>成功: {result.success} 条</span>
              </div>
              {result.failed > 0 && (
                <div className="flex items-center gap-1 text-red-600">
                  <XCircle className="w-4 h-4" />
                  <span>失败: {result.failed} 条</span>
                </div>
              )}
            </div>

            {result.errors.length > 0 && (
              <div className="max-h-40 overflow-y-auto">
                {result.errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-500 py-1">
                    {error}
                  </div>
                ))}
              </div>
            )}

            <Button
              variant="secondary"
              className="w-full mt-4"
              onClick={resetImport}
            >
              继续导入
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
