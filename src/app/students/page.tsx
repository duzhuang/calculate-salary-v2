"use client";

import { useState, useEffect } from "react";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { showToast } from "@/components/ui/Toast";
import { GRADE } from "@/lib/constants";
import { Users, Plus, Trash2, Search } from "lucide-react";

interface Student {
  id: string;
  name: string;
  phone: string | null;
  grade: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // 表单状态
  const [form, setForm] = useState({ name: "", grade: "", phone: "" });

  // 获取学生列表
  useEffect(() => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 添加学生
  const handleAdd = async () => {
    if (!form.name || !form.grade) {
      showToast("请填写姓名和年级", "error");
      return;
    }

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        showToast(error.error || "添加失败", "error");
        return;
      }

      const newStudent = await res.json();
      setStudents((prev) => [newStudent, ...prev]);
      setForm({ name: "", grade: "", phone: "" });
      setShowAdd(false);
      showToast("学生已添加");
    } catch (error) {
      showToast("添加失败", "error");
    }
  };

  // 删除学生
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await fetch(`/api/students/${deleteId}`, { method: "DELETE" });
      setStudents((prev) => prev.filter((s) => s.id !== deleteId));
      showToast("已删除");
    } catch (error) {
      showToast("删除失败", "error");
    } finally {
      setDeleteId(null);
    }
  };

  // 过滤学生
  const filteredStudents = students.filter(
    (s) =>
      s.name.includes(search) || (GRADE[s.grade] || "").includes(search)
  );

  return (
    <div>
      <Header
        title="学生管理"
        rightAction={
          <button
            onClick={() => setShowAdd(true)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-teal-600"
          >
            <Plus className="w-6 h-6" />
          </button>
        }
      />

      <div className="px-4 py-4 max-w-lg mx-auto">
        {/* 搜索框 */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索学生..."
            className="w-full pl-10 pr-3 py-2.5 min-h-[44px] text-base border border-gray-300 rounded-md
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 学生列表 */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 animate-pulse"
              >
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <EmptyState
            icon={<Users className="w-12 h-12" />}
            title={search ? "未找到匹配的学生" : "暂无学生"}
            description={search ? "请尝试其他关键词" : "点击右上角添加学生"}
            action={
              !search ? (
                <Button onClick={() => setShowAdd(true)}>
                  添加学生
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    {student.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {GRADE[student.grade]}
                    {student.phone && ` · ${student.phone}`}
                  </div>
                </div>
                <button
                  onClick={() => setDeleteId(student.id)}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 添加学生弹窗 */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="添加学生">
        <div className="space-y-4">
          <Input
            label="姓名"
            placeholder="请输入学生姓名"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <Select
            label="年级"
            options={GRADE}
            value={form.grade}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, grade: e.target.value }))
            }
          />
          <Input
            label="手机号（选填）"
            type="tel"
            placeholder="请输入手机号"
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowAdd(false)}
            >
              取消
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleAdd}>
              确认添加
            </Button>
          </div>
        </div>
      </Modal>

      {/* 删除确认弹窗 */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="删除学生"
        message="确定要删除这个学生吗？此操作不可撤销。"
        confirmText="删除"
        variant="destructive"
      />
    </div>
  );
}
