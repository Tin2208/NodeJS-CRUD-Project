module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Name already exists",
        },
        validate: {
          notEmpty: {
            args: true,
            msg: "Name cannot be empty",
          },
          len: {
            args: [1, 255],
            msg: "Name must be between 1 and 255 characters",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        isEmail: true,
        unique: {
          args: true,
          msg: "Email already exists",
        },
        validate: {
          notEmpty: {
            args: true,
            msg: "Email cannot be empty",
          },
          len: {
            args: [1, 255],
            msg: "Email must be between 1 and 255 characters",
          },
        },
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Age cannot be empty",
          },
          isInt: {
            args: true,
            msg: "Age must be an integer",
          },
          min: {
            args: 1,
            msg: "Age must be greater than 0",
          },
        },
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );

  User.associate = (models) => {
    User.belongsToMany(models.Project, {
      through: "ProjectUsers", // Tên bảng trung gian
      foreignKey: "userId",
      otherKey: "projectId",
    });
  };

  return User;
};
