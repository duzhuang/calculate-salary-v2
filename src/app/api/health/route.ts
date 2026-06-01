import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const recordCount = await prisma.record.count();
    const studentCount = await prisma.student.count();
    return NextResponse.json({
      status: "ok",
      recordCount,
      studentCount,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: String(error),
        env: {
          hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
          hasTursoToken: !!process.env.TURSO_AUTH_TOKEN,
          tursoUrl: process.env.TURSO_DATABASE_URL,
          tokenLength: process.env.TURSO_AUTH_TOKEN?.length,
          tokenPrefix: process.env.TURSO_AUTH_TOKEN?.substring(0, 20),
        },
      },
      { status: 500 }
    );
  }
}
