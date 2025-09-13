module.exports = (sequelize, DataTypes) => {
  const Parent = sequelize.define('Parent', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [2, 100]
      }
    },
    workplace: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [2, 100]
      }
    },
    relationship: {
      type: DataTypes.ENUM('father', 'mother', 'guardian', 'other'),
      allowNull: false,
      defaultValue: 'parent'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'parents',
    timestamps: true,
    paranoid: true
  });

  return Parent;
};




