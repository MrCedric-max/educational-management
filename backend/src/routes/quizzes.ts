import express from 'express';
import { PrismaClient, SchoolSystem } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const quizSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  class: z.string().min(1, 'Class is required'),
  duration: z.number().min(1, 'Duration is required'),
  instructions: z.string().optional(),
  questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    type: z.enum(['multiple-choice', 'true-false', 'short-answer', 'essay']),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string(),
    points: z.number()
  })),
  system: z.enum(['anglophone', 'francophone']).optional()
});

const quizSubmissionSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
    answer: z.string(),
    timeSpent: z.number().optional()
  }))
});

// Create a new quiz
router.post('/', async (req, res): Promise<void> => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const validatedData = quizSchema.parse(req.body);
    
    // Get user's school and class info
    const user = await prisma.user.findUnique({
      where: { id: teacherId },
      include: { school: true, teachingClass: true }
    });

    if (!user || !user.school) {
      res.status(400).json({ error: 'User not associated with a school' });
      return;
    }

    const totalPoints = validatedData.questions.reduce((sum, q) => sum + q.points, 0);

    const quiz = await prisma.quiz.create({
      data: {
        title: validatedData.title,
        subject: validatedData.subject,
        className: validatedData.class,
        duration: validatedData.duration,
        totalQuestions: validatedData.questions.length,
        totalPoints,
        difficulty: 'MEDIUM', // Default difficulty
        questions: validatedData.questions,
        instructions: validatedData.instructions || '',
        passingScore: Math.ceil(totalPoints * 0.6), // 60% passing score
        timeLimit: validatedData.duration,
        system: validatedData.system === 'francophone' ? SchoolSystem.FRANCOPHONE : SchoolSystem.ANGLOPHONE,
        level: validatedData.class,
        topic: validatedData.subject,
        teacherId,
        schoolId: user.school.id,
        classId: user.teachingClass?.id || null
      }
    });

    res.status(201).json(quiz);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: error.issues 
      });
    }
    
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all quizzes
router.get('/', async (req, res): Promise<void> => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { page = 1, limit = 10, subject, system } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      teacherId
    };

    if (subject) {
      where.subject = subject;
    }

    if (system) {
      where.system = system === 'francophone' ? SchoolSystem.FRANCOPHONE : SchoolSystem.ANGLOPHONE;
    }

    const [quizzes, total] = await Promise.all([
      prisma.quiz.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.quiz.count({ where })
    ]);

    res.json({
      quizzes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific quiz
router.get('/:id', async (req, res): Promise<void> => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const quiz = await prisma.quiz.findFirst({
      where: {
        id,
        teacherId
      }
    });

    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit quiz answers
router.post('/:id/submit', async (req, res): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const validatedData = quizSubmissionSchema.parse(req.body);

    const quiz = await prisma.quiz.findUnique({
      where: { id }
    });

    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    // Calculate score
    let score = 0;
    const results = [];
    const questions = quiz.questions as any[];

    for (const question of questions) {
      const userAnswer = validatedData.answers.find(a => a.questionId === question.id);
      const isCorrect = userAnswer?.answer === question.correctAnswer;
      
      if (isCorrect) {
        score += question.points;
      }

      results.push({
        questionId: question.id,
        question: question.question,
        userAnswer: userAnswer?.answer || '',
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: isCorrect ? question.points : 0
      });
    }

    const percentage = Math.round((score / quiz.totalPoints) * 100);

    // Create quiz attempt
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        quizId: id,
        studentId: userId, // Assuming student and user are the same for now
        userId,
        answers: validatedData.answers,
        score,
        timeSpent: validatedData.answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0)
      }
    });

    res.json({
      result: quizAttempt,
      results,
      score,
      maxScore: quiz.totalPoints,
      percentage
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: error.issues 
      });
    }
    
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a quiz
router.put('/:id', async (req, res): Promise<void> => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const validatedData = quizSchema.parse(req.body);

    const quiz = await prisma.quiz.findFirst({
      where: {
        id,
        teacherId
      }
    });

    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    const totalPoints = validatedData.questions.reduce((sum, q) => sum + q.points, 0);

    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: {
        title: validatedData.title,
        subject: validatedData.subject,
        className: validatedData.class,
        duration: validatedData.duration,
        totalQuestions: validatedData.questions.length,
        totalPoints,
        questions: validatedData.questions,
        instructions: validatedData.instructions || '',
        passingScore: Math.ceil(totalPoints * 0.6),
        timeLimit: validatedData.duration,
        system: validatedData.system === 'francophone' ? SchoolSystem.FRANCOPHONE : SchoolSystem.ANGLOPHONE,
        level: validatedData.class,
        topic: validatedData.subject,
        updatedAt: new Date()
      }
    });

    res.json(updatedQuiz);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: error.issues 
      });
    }
    
    console.error('Error updating quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a quiz
router.delete('/:id', async (req, res): Promise<void> => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const quiz = await prisma.quiz.findFirst({
      where: {
        id,
        teacherId
      }
    });

    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    await prisma.quiz.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;