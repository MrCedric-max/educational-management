module.exports = (sequelize, DataTypes) => {
  const LessonPlan = sequelize.define('LessonPlan', {
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
    objectives: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    activities: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    resources: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    assessment: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60,
      validate: {
        min: 15,
        max: 300
      }
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1, 20]
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
    scheduledDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'scheduled', 'completed', 'cancelled'),
      defaultValue: 'draft'
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'lesson_plans',
    timestamps: true,
    paranoid: true
  });

  return LessonPlan;
};




