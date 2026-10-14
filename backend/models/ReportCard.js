module.exports = (sequelize, DataTypes) => {
  const ReportCard = sequelize.define('ReportCard', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Students',
        key: 'id'
      }
    },
    studentName: {
      type: DataTypes.STRING,
      allowNull: false
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
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '2026-2027'
    },
    term: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Term 1'
    },
    system: {
      type: DataTypes.ENUM('cameroon_20', 'anglophone_percentage'),
      allowNull: false,
      defaultValue: 'cameroon_20'
    },
    totalPoints: {
      type: DataTypes.DECIMAL(7, 2),
      allowNull: false,
      defaultValue: 0.0
    },
    totalMaxPoints: {
      type: DataTypes.DECIMAL(7, 2),
      allowNull: false,
      defaultValue: 0.0
    },
    average: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.0
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    classSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    conduct: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Good'
    },
    absences: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    teacherRemarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    principalRemarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    subjectGrades: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'report_cards',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        name: 'unique_student_term_report',
        fields: ['studentId', 'term', 'academicYear']
      }
    ]
  });

  return ReportCard;
};
