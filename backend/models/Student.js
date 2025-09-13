module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 20]
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Classes',
        key: 'id'
      }
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
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
    admissionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [10, 20]
      }
    },
    emergencyContact: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    medicalInfo: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    tableName: 'students',
    timestamps: true,
    paranoid: true
  });

  return Student;
};




