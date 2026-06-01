import { NextResponse } from "next/server";

export async function GET() {
  const tursoToken = process.env.TURSO_AUTH_TOKEN || "";
  const vercelOidc = process.env.VERCEL_OIDC_TOKEN || "";

  return NextResponse.json({
    tursoToken: {
      length: tursoToken.length,
      prefix: tursoToken.substring(0, 20),
      suffix: tursoToken.substring(tursoToken.length - 20),
    },
    vercelOidc: {
      length: vercelOidc.length,
      prefix: vercelOidc.substring(0, 20),
    },
    areSame: tursoToken === vercelOidc,
    envKeys: Object.keys(process.env).filter(
      (k) => k.includes("TURSO") || k.includes("AUTH") || k.includes("VERCEL_OIDC")
    ),
  });
}
