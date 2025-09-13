module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 20]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1, 20]
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      validate: {
        min: 1,
        max: 100
      }
    },
    schoolId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Schools',
        key: 'id'
      }
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
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
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: () => {
        const year = new Date().getFullYear();
        return `${year}-${year + 1}`;
      }
    },
    semester: {
      type: DataTypes.ENUM('first', 'second', 'third', 'summer'),
      allowNull: false,
      defaultValue: 'first'
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    schedule: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    tableName: 'classes',
    timestamps: true,
    paranoid: true
  });

  return Class;
};




