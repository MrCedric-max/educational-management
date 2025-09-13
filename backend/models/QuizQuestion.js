module.exports = (sequelize, DataTypes) => {
  const QuizQuestion = sequelize.define('QuizQuestion', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('multiple_choice', 'true_false', 'short_answer', 'essay', 'fill_blank'),
      allowNull: false,
      defaultValue: 'multiple_choice'
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    correctAnswer: {
      type: DataTypes.JSON,
      allowNull: true
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 100
      }
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    quizId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Quizzes',
        key: 'id'
      }
    }
  }, {
    tableName: 'quiz_questions',
    timestamps: true,
    paranoid: true
  });

  return QuizQuestion;
};




