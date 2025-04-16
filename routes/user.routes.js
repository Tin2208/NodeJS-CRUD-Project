const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// GET /api/v1/users/getall
router.get("/getall", userController.getAllUsers);

//Get user by id
router.get("/getbyid/:id", userController.getUserById);

//Create user
router.post("/create", userController.createUser);

//Update user
router.put("/update/:id", userController.updateUser);

//Delete user
router.delete("/delete/:id", userController.deleteUser);

module.exports = router;
