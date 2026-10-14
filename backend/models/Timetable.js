module.exports = (sequelize, DataTypes) => {
  const Timetable = sequelize.define('Timetable', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Classes',
        key: 'id'
      }
    },
    className: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subjectId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Subjects',
        key: 'id'
      }
    },
    subjectName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    teacherName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 6
      },
      comment: '1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday'
    },
    periodNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10
      }
    },
    startTime: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: '07:30'
    },
    endTime: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: '08:25'
    },
    room: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Main Hall'
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '2026-2027'
    },
    term: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Term 1'
    }
  }, {
    tableName: 'timetables',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        name: 'unique_class_slot',
        fields: ['classId', 'dayOfWeek', 'periodNumber']
      },
      {
        unique: true,
        name: 'unique_teacher_slot',
        fields: ['teacherId', 'dayOfWeek', 'periodNumber']
      }
    ]
  });

  return Timetable;
};
