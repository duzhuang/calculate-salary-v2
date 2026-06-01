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
      env: {
        hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
        hasTursoToken: !!process.env.TURSO_AUTH_TOKEN,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: String(error),
        stack: error instanceof Error ? error.stack : undefined,
        env: {
          hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
          hasTursoToken: !!process.env.TURSO_AUTH_TOKEN,
        },
      },
      { status: 500 }
    );
  }
}
