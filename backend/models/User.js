const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100]
      }
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'school_admin', 'teacher', 'student', 'parent'),
      allowNull: false,
      defaultValue: 'teacher'
    },
    schoolId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Schools',
        key: 'id'
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    language: {
      type: DataTypes.ENUM('en', 'fr'),
      defaultValue: 'en'
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [10, 15]
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true, // Soft delete
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      }
    }
  });

  // Instance methods
  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    delete values.resetPasswordToken;
    delete values.resetPasswordExpires;
    delete values.emailVerificationToken;
    return values;
  };

  return User;
};




