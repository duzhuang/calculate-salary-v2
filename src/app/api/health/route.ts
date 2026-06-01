import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@libsql/client";

export async function GET() {
  try {
    // Test 1: Direct libsql client
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
    const directResult = await client.execute("SELECT COUNT(*) as count FROM Record");

    // Test 2: Prisma
    const recordCount = await prisma.record.count();

    return NextResponse.json({
      status: "ok",
      directCount: directResult.rows[0],
      prismaCount: recordCount,
      env: {
        hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
        hasTursoToken: !!process.env.TURSO_AUTH_TOKEN,
        tursoUrl: process.env.TURSO_DATABASE_URL,
      },
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
        },
      },
      { status: 500 }
    );
  }
}
