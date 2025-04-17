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
        isEmty: false,
        notEmpty: true,
        len: [1, 255]
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        notEmpty: true,
        len: [1, 255],
        isEmail: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        notEmpty: true
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );
  return User;
};
