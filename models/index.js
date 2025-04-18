const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config");

// Khởi tạo Sequelize
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Nạp models
db.user = require("./user.model")(sequelize, DataTypes);
db.project = require("./project.model")(sequelize, DataTypes);

// Định nghĩa quan hệ
db.user.hasMany(db.project, { foreignKey: "userId" });
db.project.belongsTo(db.user, { foreignKey: "userId" });

// Đồng bộ với CSDL
db.sequelize
  .sync({ force: false }) 
  .then(() => {
    console.log("✅ Database synced");
  })
  .catch((err) => {
    console.error("❌ Error syncing database:", err);
  });

module.exports = db;
