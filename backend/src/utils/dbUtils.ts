import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Test database connection and log status.
 */
export const testDatabaseConnection = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('Database connection successful');
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw new Error('Database connection failed');
  } finally {
    await prisma.$disconnect();
  }
};