import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || 'postgresql://admin:password@localhost:5432/educational_system_test'
    }
  }
});

beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
  
  // Clean up test database
  await prisma.quizAttempt.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lessonPlan.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.progressData.deleteMany();
  await prisma.message.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.report.deleteMany();
  await prisma.schoolAnalytics.deleteMany();
  await prisma.student.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();
  await prisma.school.deleteMany();
});

afterAll(async () => {
  // Clean up test database
  await prisma.quizAttempt.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lessonPlan.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.progressData.deleteMany();
  await prisma.message.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.report.deleteMany();
  await prisma.schoolAnalytics.deleteMany();
  await prisma.student.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();
  await prisma.school.deleteMany();
  
  // Disconnect from database
  await prisma.$disconnect();
});

// Global test utilities
global.prisma = prisma;













