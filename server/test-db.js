import { prisma } from "./src/lib/prisma.js";

async function testDatabase() {
  try {
    await prisma.$connect();

    console.log("✅ Database connected successfully!");

    const result = await prisma.$queryRaw`SELECT current_database()`;

    console.log("Connected database:", result);
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();