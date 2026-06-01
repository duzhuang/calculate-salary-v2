import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { tursoConfig } from "./config";

function createPrismaClient() {
  const url = tursoConfig.url;
  const authToken = tursoConfig.authToken;

  if (url && authToken) {
    const adapter = new PrismaLibSQL({ url, authToken });
    return new PrismaClient({ adapter });
  }

  return new PrismaClient();
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
