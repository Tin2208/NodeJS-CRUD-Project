const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const db = require("./models");
const swaggerSpec = require("./swagger.config");
const apiRoutes = require("./routes/api.routes");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/v1", apiRoutes);

// Test route
app.get("/", (req, res) => {
  res.status(200).send("<h1>Hello World</h1>");
});

// Connect to DB and start server
db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully!");
    return db.sequelize.sync();
  })
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err);
    process.exit(1);
  });
