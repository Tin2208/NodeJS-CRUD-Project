const express = require("express");
const db = require("./models");
const morgan = require("morgan");
const dotenv = require("dotenv");

//config evn
dotenv.config();

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

app.use(express.json());

// Routes

app.use("/api/v1/users", require("./routes/user.routes"));

app.get("/test", (req, res) => {
  res.status(200).send("<h1>Hello World</h1>");
});

// Connect to DB
db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully!");
    return db.sequelize.sync();
  })
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" Unable to connect to the database:", err);
    process.exit(1);
  });
