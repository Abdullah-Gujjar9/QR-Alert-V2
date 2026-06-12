import clientPkg from "@prisma/client";

// Handle environments where @prisma/client may export differently
const PrismaClientCtor = (clientPkg as any).PrismaClient ?? clientPkg;
type PrismaClientType = InstanceType<typeof PrismaClientCtor>;

const globalForPrisma = global as unknown as {
  prisma: PrismaClientType;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClientCtor();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}