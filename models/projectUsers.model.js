module.exports = (sequelize, DataTypes) => {
    const ProjectUsers = sequelize.define(
      "ProjectUsers",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        projectId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "projects",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
        },
      },
      {
        tableName: "ProjectUsers",
        timestamps: true,
      }
    );
  
    return ProjectUsers;
  };