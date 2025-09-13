module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
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
      unique: true,
      validate: {
        len: [2, 20]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    level: {
      type: DataTypes.ENUM('primary', 'secondary', 'high_school', 'university'),
      allowNull: false,
      defaultValue: 'secondary'
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 10
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'subjects',
    timestamps: true,
    paranoid: true
  });

  return Subject;
};




