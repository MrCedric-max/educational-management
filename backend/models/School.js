module.exports = (sequelize, DataTypes) => {
  const School = sequelize.define('School', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 200]
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
    type: {
      type: DataTypes.ENUM('public', 'private', 'charter', 'international'),
      allowNull: false,
      defaultValue: 'public'
    },
    level: {
      type: DataTypes.ENUM('primary', 'secondary', 'high_school', 'university', 'mixed'),
      allowNull: false,
      defaultValue: 'mixed'
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [2, 100]
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [2, 100]
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [2, 100]
      }
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [3, 20]
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [10, 20]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    principalName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [2, 100]
      }
    },
    principalEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    establishedYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1800,
        max: new Date().getFullYear()
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    tableName: 'schools',
    timestamps: true,
    paranoid: true
  });

  return School;
};




