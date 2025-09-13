const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

// Import all models
const User = require('./User')(sequelize, DataTypes);
const School = require('./School')(sequelize, DataTypes);
const Class = require('./Class')(sequelize, DataTypes);
const Student = require('./Student')(sequelize, DataTypes);
const Teacher = require('./Teacher')(sequelize, DataTypes);
const Parent = require('./Parent')(sequelize, DataTypes);
const Subject = require('./Subject')(sequelize, DataTypes);
const LessonPlan = require('./LessonPlan')(sequelize, DataTypes);
const Quiz = require('./Quiz')(sequelize, DataTypes);
const QuizQuestion = require('./QuizQuestion')(sequelize, DataTypes);
const QuizSubmission = require('./QuizSubmission')(sequelize, DataTypes);
const Notification = require('./Notification')(sequelize, DataTypes);
const File = require('./File')(sequelize, DataTypes);
const Attendance = require('./Attendance')(sequelize, DataTypes);
const Grade = require('./Grade')(sequelize, DataTypes);

// Define associations
const defineAssociations = () => {
  // User associations
  User.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });
  School.hasMany(User, { foreignKey: 'schoolId', as: 'users' });

  // Class associations
  Class.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });
  Class.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });
  Class.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
  
  School.hasMany(Class, { foreignKey: 'schoolId', as: 'classes' });
  Teacher.hasMany(Class, { foreignKey: 'teacherId', as: 'classes' });
  Subject.hasMany(Class, { foreignKey: 'subjectId', as: 'classes' });

  // Student associations
  Student.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
  Student.belongsTo(Parent, { foreignKey: 'parentId', as: 'parent' });
  Student.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });
  
  Class.hasMany(Student, { foreignKey: 'classId', as: 'students' });
  Parent.hasMany(Student, { foreignKey: 'parentId', as: 'students' });
  School.hasMany(Student, { foreignKey: 'schoolId', as: 'students' });

  // Lesson Plan associations
  LessonPlan.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });
  LessonPlan.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
  LessonPlan.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
  
  Teacher.hasMany(LessonPlan, { foreignKey: 'teacherId', as: 'lessonPlans' });
  Class.hasMany(LessonPlan, { foreignKey: 'classId', as: 'lessonPlans' });
  Subject.hasMany(LessonPlan, { foreignKey: 'subjectId', as: 'lessonPlans' });

  // Quiz associations
  Quiz.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });
  Quiz.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
  Quiz.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
  Quiz.hasMany(QuizQuestion, { foreignKey: 'quizId', as: 'questions' });
  Quiz.hasMany(QuizSubmission, { foreignKey: 'quizId', as: 'submissions' });
  
  Teacher.hasMany(Quiz, { foreignKey: 'teacherId', as: 'quizzes' });
  Class.hasMany(Quiz, { foreignKey: 'classId', as: 'quizzes' });
  Subject.hasMany(Quiz, { foreignKey: 'subjectId', as: 'quizzes' });

  // Quiz Question associations
  QuizQuestion.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });

  // Quiz Submission associations
  QuizSubmission.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });
  QuizSubmission.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
  
  Student.hasMany(QuizSubmission, { foreignKey: 'studentId', as: 'quizSubmissions' });

  // Notification associations
  Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });

  // File associations
  File.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });
  User.hasMany(File, { foreignKey: 'uploadedBy', as: 'files' });

  // Attendance associations
  Attendance.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
  Attendance.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
  
  Student.hasMany(Attendance, { foreignKey: 'studentId', as: 'attendance' });
  Class.hasMany(Attendance, { foreignKey: 'classId', as: 'attendance' });

  // Grade associations
  Grade.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
  Grade.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });
  Grade.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
  
  Student.hasMany(Grade, { foreignKey: 'studentId', as: 'grades' });
  Quiz.hasMany(Grade, { foreignKey: 'quizId', as: 'grades' });
  Class.hasMany(Grade, { foreignKey: 'classId', as: 'grades' });
};

// Initialize associations
defineAssociations();

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  School,
  Class,
  Student,
  Teacher,
  Parent,
  Subject,
  LessonPlan,
  Quiz,
  QuizQuestion,
  QuizSubmission,
  Notification,
  File,
  Attendance,
  Grade
};




