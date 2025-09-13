import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get student progress analytics
router.get('/progress', async (req, res): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { studentId, subject, startDate, endDate } = req.query;

    const where: any = {};
    if (studentId) {
      where.studentId = studentId;
    } else {
      where.userId = userId;
    }

    if (subject) {
      where.subject = subject;
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    // Get quiz attempts for progress calculation
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: {
        userId: where.userId || where.studentId
      },
      include: {
        quiz: true
      }
    });

    // Get progress data
    const progressData = await prisma.progressData.findMany({
      where
    });

    // Calculate analytics
    const totalQuizzes = quizAttempts.length;
    const averageScore = totalQuizzes > 0 
      ? quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalQuizzes
      : 0;

    const subjectPerformance = quizAttempts.reduce((acc: any, attempt) => {
      const subject = attempt.quiz.subject;
      if (!acc[subject]) {
        acc[subject] = { total: 0, count: 0, average: 0 };
      }
      acc[subject].total += attempt.score;
      acc[subject].count += 1;
      acc[subject].average = acc[subject].total / acc[subject].count;
      return acc;
    }, {});

    const recentActivity = quizAttempts
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
      .slice(0, 10)
      .map(attempt => ({
        id: attempt.id,
        quizTitle: attempt.quiz.title,
        subject: attempt.quiz.subject,
        score: attempt.score,
        completedAt: attempt.completedAt
      }));

    // Calculate weekly progress
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentAttempts = quizAttempts.filter(
      attempt => attempt.completedAt >= thirtyDaysAgo
    );

    const weeklyProgress = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(thirtyDaysAgo);
      weekStart.setDate(weekStart.getDate() + (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekResults = recentAttempts.filter(
        attempt => attempt.completedAt >= weekStart && attempt.completedAt <= weekEnd
      );

      const weekAverage = weekResults.length > 0
        ? weekResults.reduce((sum, attempt) => sum + attempt.score, 0) / weekResults.length
        : 0;

      weeklyProgress.push({
        week: i + 1,
        average: weekAverage,
        attempts: weekResults.length
      });
    }

    res.json({
      totalQuizzes,
      averageScore: Math.round(averageScore),
      subjectPerformance,
      recentActivity,
      weeklyProgress,
      progressData
    });
  } catch (error) {
    console.error('Error fetching progress analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get lesson analytics
router.get('/lessons', async (req, res): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { subject, system, startDate, endDate } = req.query;

    const where: any = {
      teacherId: userId
    };

    if (subject) {
      where.subject = subject;
    }

    if (system) {
      where.system = system;
    }

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const lessonPlans = await prisma.lessonPlan.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    // Calculate analytics
    const totalLessons = lessonPlans.length;
    const subjectBreakdown = lessonPlans.reduce((acc: any, lesson) => {
      const subject = lesson.subject;
      if (!acc[subject]) {
        acc[subject] = 0;
      }
      acc[subject]++;
      return acc;
    }, {});

    const systemBreakdown = lessonPlans.reduce((acc: any, lesson) => {
      const system = lesson.system;
      if (!acc[system]) {
        acc[system] = 0;
      }
      acc[system]++;
      return acc;
    }, {});

    const recentLessons = lessonPlans.slice(0, 10).map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      subject: lesson.subject,
      className: lesson.className,
      system: lesson.system,
      createdAt: lesson.createdAt
    }));

    res.json({
      totalLessons,
      subjectBreakdown,
      systemBreakdown,
      recentLessons,
      lessons: lessonPlans
    });
  } catch (error) {
    console.error('Error fetching lesson analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;