module.exports = (sequelize, DataTypes) => {
  const QuizSubmission = sequelize.define('QuizSubmission', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    answers: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    timeSpent: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM('in_progress', 'submitted', 'graded'),
      defaultValue: 'in_progress'
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gradedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    feedback: {
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
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Students',
        key: 'id'
      }
    }
  }, {
    tableName: 'quiz_submissions',
    timestamps: true,
    paranoid: true
  });

  return QuizSubmission;
};




