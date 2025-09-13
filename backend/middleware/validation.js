const Joi = require('joi');

// Validation schemas
const schemas = {
  // User validation
  user: {
    register: Joi.object({
      email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
      password: Joi.string().min(6).max(100).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password must not exceed 100 characters',
        'any.required': 'Password is required'
      }),
      fullName: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Full name must be at least 2 characters long',
        'string.max': 'Full name must not exceed 100 characters',
        'any.required': 'Full name is required'
      }),
      role: Joi.string().valid('super_admin', 'school_admin', 'teacher', 'student', 'parent').optional(),
      schoolId: Joi.string().uuid().optional(),
      language: Joi.string().valid('en', 'fr').optional(),
      phone: Joi.string().min(10).max(20).optional(),
      address: Joi.string().max(500).optional(),
      dateOfBirth: Joi.date().max('now').optional(),
      gender: Joi.string().valid('male', 'female', 'other').optional()
    }),
    
    login: Joi.object({
      email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
      password: Joi.string().required().messages({
        'any.required': 'Password is required'
      })
    }),

    update: Joi.object({
      fullName: Joi.string().min(2).max(100).optional(),
      phone: Joi.string().min(10).max(20).optional(),
      address: Joi.string().max(500).optional(),
      dateOfBirth: Joi.date().max('now').optional(),
      gender: Joi.string().valid('male', 'female', 'other').optional(),
      language: Joi.string().valid('en', 'fr').optional()
    })
  },

  // School validation
  school: {
    create: Joi.object({
      name: Joi.string().min(2).max(200).required().messages({
        'string.min': 'School name must be at least 2 characters long',
        'string.max': 'School name must not exceed 200 characters',
        'any.required': 'School name is required'
      }),
      code: Joi.string().min(2).max(20).required().messages({
        'string.min': 'School code must be at least 2 characters long',
        'string.max': 'School code must not exceed 20 characters',
        'any.required': 'School code is required'
      }),
      type: Joi.string().valid('public', 'private', 'charter', 'international').optional(),
      level: Joi.string().valid('primary', 'secondary', 'high_school', 'university', 'mixed').optional(),
      address: Joi.string().max(500).optional(),
      city: Joi.string().min(2).max(100).optional(),
      state: Joi.string().min(2).max(100).optional(),
      country: Joi.string().min(2).max(100).optional(),
      postalCode: Joi.string().min(3).max(20).optional(),
      phone: Joi.string().min(10).max(20).optional(),
      email: Joi.string().email().optional(),
      website: Joi.string().uri().optional(),
      principalName: Joi.string().min(2).max(100).optional(),
      principalEmail: Joi.string().email().optional(),
      establishedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
      capacity: Joi.number().integer().min(1).optional(),
      description: Joi.string().max(1000).optional()
    })
  },

  // Class validation
  class: {
    create: Joi.object({
      name: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Class name must be at least 2 characters long',
        'string.max': 'Class name must not exceed 100 characters',
        'any.required': 'Class name is required'
      }),
      code: Joi.string().min(2).max(20).required().messages({
        'string.min': 'Class code must be at least 2 characters long',
        'string.max': 'Class code must not exceed 20 characters',
        'any.required': 'Class code is required'
      }),
      description: Joi.string().max(500).optional(),
      grade: Joi.string().min(1).max(20).optional(),
      capacity: Joi.number().integer().min(1).max(100).optional(),
      schoolId: Joi.string().uuid().required(),
      teacherId: Joi.string().uuid().optional(),
      subjectId: Joi.string().uuid().optional(),
      academicYear: Joi.string().optional(),
      semester: Joi.string().valid('first', 'second', 'third', 'summer').optional(),
      startDate: Joi.date().optional(),
      endDate: Joi.date().min(Joi.ref('startDate')).optional()
    })
  },

  // Quiz validation
  quiz: {
    create: Joi.object({
      title: Joi.string().min(2).max(200).required().messages({
        'string.min': 'Quiz title must be at least 2 characters long',
        'string.max': 'Quiz title must not exceed 200 characters',
        'any.required': 'Quiz title is required'
      }),
      description: Joi.string().max(500).optional(),
      instructions: Joi.string().max(1000).optional(),
      timeLimit: Joi.number().integer().min(1).max(300).optional(),
      totalPoints: Joi.number().integer().min(1).optional(),
      passingScore: Joi.number().integer().min(0).max(100).optional(),
      attempts: Joi.number().integer().min(1).max(10).optional(),
      classId: Joi.string().uuid().optional(),
      subjectId: Joi.string().uuid().optional(),
      startDate: Joi.date().optional(),
      endDate: Joi.date().min(Joi.ref('startDate')).optional()
    })
  },

  // Lesson plan validation
  lessonPlan: {
    create: Joi.object({
      title: Joi.string().min(2).max(200).required().messages({
        'string.min': 'Lesson plan title must be at least 2 characters long',
        'string.max': 'Lesson plan title must not exceed 200 characters',
        'any.required': 'Lesson plan title is required'
      }),
      description: Joi.string().max(500).optional(),
      objectives: Joi.array().items(Joi.string().max(200)).optional(),
      content: Joi.string().max(5000).optional(),
      activities: Joi.array().items(Joi.string().max(500)).optional(),
      resources: Joi.array().items(Joi.string().max(200)).optional(),
      assessment: Joi.object().optional(),
      duration: Joi.number().integer().min(15).max(300).optional(),
      grade: Joi.string().min(1).max(20).optional(),
      classId: Joi.string().uuid().optional(),
      subjectId: Joi.string().uuid().optional(),
      scheduledDate: Joi.date().optional()
    })
  }
};

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    // Replace the request property with the validated and sanitized value
    req[property] = value;
    next();
  };
};

// Common validation middleware
const validateUser = {
  register: validate(schemas.user.register),
  login: validate(schemas.user.login),
  update: validate(schemas.user.update)
};

const validateSchool = {
  create: validate(schemas.school.create)
};

const validateClass = {
  create: validate(schemas.class.create)
};

const validateQuiz = {
  create: validate(schemas.quiz.create)
};

const validateLessonPlan = {
  create: validate(schemas.lessonPlan.create)
};

module.exports = {
  schemas,
  validate,
  validateUser,
  validateSchool,
  validateClass,
  validateQuiz,
  validateLessonPlan
};




