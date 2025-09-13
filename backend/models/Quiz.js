module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define('Quiz', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    timeLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 300
      }
    },
    totalPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      validate: {
        min: 1
      }
    },
    passingScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 10
      }
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Classes',
        key: 'id'
      }
    },
    subjectId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Subjects',
        key: 'id'
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    tableName: 'quizzes',
    timestamps: true,
    paranoid: true
  });

  return Quiz;
};




