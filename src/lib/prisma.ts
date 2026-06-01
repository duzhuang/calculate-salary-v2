import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

function createPrismaClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.DB_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODAyOTI1ODYsImlkIjoiMDE5ZTc4MTQtNjQwMS03YmJjLThjZjktYzgzNmVjNzYxYzA3IiwicmlkIjoiNzk2OWJhNTAtNWEwZi00MTMyLTlhMTEtNzg1ODQwMTRhZDViIn0.5hWdUxBOEmLEn-2AUFBbBqriJWc2-_89Gm162fv43Nn_D6KcsUySfQjafRBSqU3PCFBUToMkRg7YluFKYuesDQ";

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
