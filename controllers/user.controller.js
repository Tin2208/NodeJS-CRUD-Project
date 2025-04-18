const db = require("../models");
const validators = require("../utils/validators");

//Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await db.user.findAll();
    console.log("Users fetched:", users);
    if (users.length === 0) {
      res.status(404).json({
        success: false,
        error: "No users found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Get user by id
const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await db.user.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Users with id ${userId} not found`,
      });
    }
    console.log("User fetched:", user);
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//Create user
const createUser = async (req, res) => {
  const { name, email, age } = req.body;

  // Validate fields
  const nameValidation = validators.isValidString(name, "Name");
  if (!nameValidation.valid) {
    return res
      .status(400)
      .json({ success: false, message: nameValidation.message });
  }

  const emailValidation = validators.isValidEmail(email, "Email");
  if (!emailValidation.valid) {
    return res
      .status(400)
      .json({ success: false, message: emailValidation.message });
  }

  const ageValidation = validators.isValidNumber(age, "Age");
  if (!ageValidation.valid) {
    return res
      .status(400)
      .json({ success: false, message: ageValidation.message });
  }

  try {
    const existingUser = await db.user.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ email }, { name }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User name or email already exists",
      });
    }

    const newUser = await db.user.create({ name, email, age });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//Update user
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, age } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID or provide id",
    });
  }

  // Optional fields validation
  if (name !== undefined) {
    const nameValidation = validators.isValidString(name, "Name");
    if (!nameValidation.valid) {
      return res
        .status(400)
        .json({ success: false, message: nameValidation.message });
    }
  }

  if (email !== undefined) {
    const emailValidation = validators.isValidEmail(email, "Email");
    if (!emailValidation.valid) {
      return res
        .status(400)
        .json({ success: false, message: emailValidation.message });
    }
  }

  if (age !== undefined) {
    const ageValidation = validators.isValidNumber(age, "Age");
    if (!ageValidation.valid) {
      return res
        .status(400)
        .json({ success: false, message: ageValidation.message });
    }
  }

  try {
    const user = await db.user.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Users with id ${userId} not found`,
      });
    }

    const existingUser = await db.user.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ email }, { name }],
      },
    });

    if (existingUser && existingUser.id !== parseInt(userId)) {
      return res.status(409).json({
        success: false,
        message: "User name or email already exists",
      });
    }

    await user.update({
      name: name ?? user.name,
      email: email ?? user.email,
      age: age ?? user.age,
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//Delete user
const deleteUser = async (req, res) => {
  const userID = req.params.id;
  if (!userID) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID or provide id",
    });
  }
  try {
    const user = await db.user.findByPk(userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Users with id ${userID} not found`,
      });
    }
    await user.destroy();
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
