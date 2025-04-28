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
    },
    {
      tableName: "projects",
      timestamps: false,
    }
  );

  Project.associate = (models) => {
    Project.belongsToMany(models.user, {
      through: "ProjectUsers",
      foreignKey: "projectId",
      cotherKey: "userId",
    });
  };

  return Project;
};
