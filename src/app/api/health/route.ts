import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const recordCount = await prisma.record.count();
    const studentCount = await prisma.student.count();
    return NextResponse.json({ status: "ok", recordCount, studentCount });
  } catch (error) {
    return NextResponse.json(
      { status: "error", error: String(error) },
      { status: 500 }
    );
  }
}
