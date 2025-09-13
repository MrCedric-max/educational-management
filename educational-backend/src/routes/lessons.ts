import express from 'express';
import { PrismaClient, SchoolSystem } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const lessonPlanSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  class: z.string().min(1, 'Class is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().optional(),
  duration: z.string().min(1, 'Duration is required'),
  learningTheme: z.string().min(1, 'Learning theme is required'),
  selectedObjective: z.string().optional(),
  domain: z.string().optional(),
  entryBehaviour: z.string().optional(),
  objectives: z.array(z.object({
    id: z.string(),
    description: z.string(),
    completed: z.boolean(),
    selected: z.boolean().optional()
  })).optional(),
  materials: z.array(z.object({
    id: z.string(),
    name: z.string(),
    selected: z.boolean().optional()
  })).optional(),
  activities: z.array(z.object({
    id: z.string(),
    description: z.string()
  })).optional(),
  stages: z.array(z.object({
    id: z.string(),
    stage: z.string(),
    content: z.string(),
    facilitatingActivities: z.string(),
    learningActivities: z.string(),
    resources: z.string()
  })).optional(),
  assessmentMethod: z.string().optional(),
  references: z.string().optional(),
  system: z.enum(['anglophone', 'francophone']).optional()
});

// Create a new lesson plan
router.post('/', async (req, res): Promise<void> => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const validatedData = lessonPlanSchema.parse(req.body);
    
    // Get user's school and class info
    const user = await prisma.user.findUnique({
      where: { id: teacherId },
      include: { school: true, teachingClass: true }
    });

    if (!user || !user.school) {
      res.status(400).json({ error: 'User not associated with a school' });
      return;
    }

    const lessonPlan = await prisma.lessonPlan.create({
      data: {
        title: validatedData.title,
        subject: validatedData.subject,
        className: validatedData.class,
        date: validatedData.date,
        duration: parseInt(validatedData.duration) || 45,
        learningTheme: validatedData.learningTheme,
        time: validatedData.time || '',
        domain: validatedData.domain || '',
        entryBehaviour: validatedData.entryBehaviour || '',
        specificObjectives: validatedData.objectives?.map(obj => obj.description) || [],
        didacticMaterials: validatedData.materials?.map(mat => mat.name) || [],
        references: validatedData.references ? [validatedData.references] : [],
        stages: validatedData.stages || [],
        evaluation: validatedData.assessmentMethod || '',
        homework: '',
        notes: '',
        system: validatedData.system === 'francophone' ? SchoolSystem.FRANCOPHONE : SchoolSystem.ANGLOPHONE,
        level: validatedData.class,
        enrolment: 30, // Default value
        averageAge: 8, // Default value
        teacherId,
        schoolId: user.school.id,
        classId: user.teachingClass?.id || null
      }
    });

    res.status(201).json(lessonPlan);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: error.issues 
      });
    }
    
    console.error('Error creating lesson plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all lesson plans
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

    const [lessonPlans, total] = await Promise.all([
      prisma.lessonPlan.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.lessonPlan.count({ where })
    ]);

    res.json({
      lessonPlans,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching lesson plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific lesson plan
router.get('/:id', async (req, res): Promise<void> => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const lessonPlan = await prisma.lessonPlan.findFirst({
      where: {
        id,
        teacherId
      }
    });

    if (!lessonPlan) {
      res.status(404).json({ error: 'Lesson plan not found' });
      return;
    }

    res.json(lessonPlan);
  } catch (error) {
    console.error('Error fetching lesson plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a lesson plan
router.put('/:id', async (req, res): Promise<void> => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const validatedData = lessonPlanSchema.parse(req.body);

    const lessonPlan = await prisma.lessonPlan.findFirst({
      where: {
        id,
        teacherId
      }
    });

    if (!lessonPlan) {
      res.status(404).json({ error: 'Lesson plan not found' });
      return;
    }

    const updatedLessonPlan = await prisma.lessonPlan.update({
      where: { id },
      data: {
        title: validatedData.title,
        subject: validatedData.subject,
        className: validatedData.class,
        date: validatedData.date,
        duration: parseInt(validatedData.duration) || 45,
        learningTheme: validatedData.learningTheme,
        time: validatedData.time || '',
        domain: validatedData.domain || '',
        entryBehaviour: validatedData.entryBehaviour || '',
        specificObjectives: validatedData.objectives?.map(obj => obj.description) || [],
        didacticMaterials: validatedData.materials?.map(mat => mat.name) || [],
        references: validatedData.references ? [validatedData.references] : [],
        stages: validatedData.stages || [],
        evaluation: validatedData.assessmentMethod || '',
        system: validatedData.system === 'francophone' ? SchoolSystem.FRANCOPHONE : SchoolSystem.ANGLOPHONE,
        updatedAt: new Date()
      }
    });

    res.json(updatedLessonPlan);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: error.issues 
      });
    }
    
    console.error('Error updating lesson plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a lesson plan
router.delete('/:id', async (req, res): Promise<void> => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const lessonPlan = await prisma.lessonPlan.findFirst({
      where: {
        id,
        teacherId
      }
    });

    if (!lessonPlan) {
      res.status(404).json({ error: 'Lesson plan not found' });
      return;
    }

    await prisma.lessonPlan.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting lesson plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;