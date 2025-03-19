import { PrismaClient } from '@prisma/client';

// PrismaClient è collegato al global object in development per prevenire
// troppe connessioni al database durante hot-reloading
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
