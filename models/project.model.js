module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    "Project",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Title cannot be empty",
          },
          len: {
            args: [1, 255],
            msg: "Title must be between 1 and 255 characters",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Description cannot be empty",
          },
          len: {
            args: [1, 1000],
            msg: "Description must be between 1 and 1000 characters",
          },
          notEmpty: {
            args: true,
            msg: "description cannot be empty",
          },
        },
      },
      status: {
        type: DataTypes.ENUM("pending", "in progress", "completed"),
        defaultValue: "pending",
        validate: {
          isIn: {
            args: [["pending", "in progress", "completed"]],
            msg: "Status must be one of: pending, in progress, completed",
          },
          notEmpty: {
            args: true,
            msg: "Status cannot be empty",
          },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        validate: {
          isInt: {
            msg: "User ID must be an integer",
          },
          min: {
            args: 1,
            msg: "User ID must be greater than 0",
          },
          notEmpty: {
            args: true,
            msg: "UserId cannot be empty",
          },
        },
      },
    },
    {
      tableName: "projects",
      timestamps: false,
    }
  );
  return Project;
};
