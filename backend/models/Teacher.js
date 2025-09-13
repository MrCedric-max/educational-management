module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 20]
      }
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [2, 100]
      }
    },
    qualification: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [2, 100]
      }
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [2, 100]
      }
    },
    hireDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'teachers',
    timestamps: true,
    paranoid: true
  });

  return Teacher;
};




