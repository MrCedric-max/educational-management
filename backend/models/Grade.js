module.exports = (sequelize, DataTypes) => {
  const Grade = sequelize.define('Grade', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    maxScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
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
    letterGrade: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1, 5]
      }
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    gradedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Students',
        key: 'id'
      }
    },
    quizId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Quizzes',
        key: 'id'
      }
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Classes',
        key: 'id'
      }
    },
    gradedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    tableName: 'grades',
    timestamps: true,
    paranoid: true
  });

  return Grade;
};




