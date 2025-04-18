const validators = require("../utils/validators");
const db = require("../models");

//Get all projects
const getAllProjects = async (req, res) => {
  try {
    const project = await db.project.findAll();
    console.log("Projects fetched:", project);
    if (project.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No projects",
      });
    }
    res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//Get project by id
const getProjectById = async (req, res) => {
  const projectId = req.params.id;

  try {
    const project = await db.project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with id ${projectId} not found`,
        error: error.message,
      });
    }
    console.log("Project fetched:", project);
    res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//Create project
const createProject = async (req, res) => {
  const { title, description, status, userId } = req.body;

  if (
    !title ||
    !description ||
    !status ||
    userId === undefined ||
    userId === null ||
    userId === ""
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required: title, description, status, userId",
    });
  }

  const parsedUserId = Number(userId);

  const titleValidation = validators.isValidString(title, "Title");
  const descriptionValidation = validators.isValidString(
    description,
    "Description"
  );
  const statusValidation = validators.isValidString(status, "Status");
  const userIdValidation = validators.isValidNumber(parsedUserId, "User ID");

  if (!titleValidation.valid) {
    return res
      .status(400)
      .json({ success: false, message: titleValidation.message });
  }
  if (!descriptionValidation.valid) {
    return res
      .status(400)
      .json({ success: false, message: descriptionValidation.message });
  }
  if (!statusValidation.valid) {
    return res
      .status(400)
      .json({ success: false, message: statusValidation.message });
  }
  if (!userIdValidation.valid) {
    return res
      .status(400)
      .json({ success: false, message: userIdValidation.message });
  }

  try {
    const user = await db.user.findByPk(parsedUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with id ${parsedUserId} does not exist`,
      });
    }

    const newProject = await db.project.create({
      title,
      description,
      status,
      userId: parsedUserId,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//Update project
const updateProject = async (req, res) => {
  const projectId = req.params.id;
  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: "Project ID is required",
    });
  }
  const { title, description, status, userId } = req.body;
  const titleValidation = validators.isValidString(title, "Title");
  const descriptionValidation = validators.isValidString(
    description,
    "Description"
  );
  const statusValidation = validators.isValidString(status, "Status");
  const userIdValidation = validators.isValidNumber(userId, "User ID");
  if (!titleValidation.valid) {
    return res.status(400).json({
      success: false,
      message: titleValidation.message,
    });
  }
  if (!descriptionValidation.valid) {
    return res.status(400).json({
      success: false,
      message: descriptionValidation.message,
    });
  }
  if (!statusValidation.valid) {
    return res.status(400).json({
      success: false,
      message: statusValidation.message,
    });
  }
  if (!userIdValidation.valid) {
    return res.status(400).json({
      success: false,
      message: userIdValidation.message,
    });
  }
  try {
    const project = await db.project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with id ${projectId} does not exist`,
        error: error.message,
      });
    }
    const updateProject = await db.project.update(
      {
        title,
        description,
        status,
        userId,
      },
      {
        where: { id: projectId },
      }
    );
    console.log("Project updated:", updateProject);
    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updateProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//Delete project
const deleteProject = async (req, res) => {
  const projectId = req.params.id;
  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: "Project ID is required",
    });
  }
  try {
    const project = await db.project.findByPk(projectId);
    if (!project) {
      return res.status(400).json({
        success: false,
        message: `Project with id ${projectId} does not exist`,
      });
    }
    await db.project.destroy({
      where: { id: projectId },
    });
    console.log("Project deleted:", project);
    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
