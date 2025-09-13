module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
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
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('info', 'warning', 'error', 'success', 'reminder'),
      allowNull: false,
      defaultValue: 'info'
    },
    category: {
      type: DataTypes.ENUM('system', 'academic', 'assignment', 'quiz', 'announcement', 'reminder'),
      allowNull: false,
      defaultValue: 'system'
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'notifications',
    timestamps: true,
    paranoid: true
  });

  return Notification;
};




