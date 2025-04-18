const validators = require("../utils/validators");
const db = require("../models");

console.log("📦 project.controller loaded");

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
  console.log(`createProject: raw req.body=${JSON.stringify(req.body)}`);
  const { title, description, status, userId } = req.body;

  console.log(
    `createProject: userId=${JSON.stringify(
      userId
    )}, type=${typeof userId}, isArray=${Array.isArray(userId)}`
  );

  const titleValidation = validators.isValidString(title, "Title");
  const descriptionValidation = validators.isValidString(
    description,
    "Description"
  );
  const statusValidation = validators.isValidString(status, "Status");
  const userIdValidation = validators.isValidNumber(userId, "User ID");

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

  console.log("userId raw:", userId);
  console.log("type:", typeof userId);
  console.log("isArray:", Array.isArray(userId));

  const validatedUserId = userIdValidation.value;

  try {
    const user = await db.user.findByPk(validatedUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with id ${validatedUserId} does not exist`,
      });
    }

    const newProject = await db.project.create({
      title,
      description,
      status,
      userId: validatedUserId,
    });

    console.log("Project created:", JSON.stringify(newProject, null, 2));

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

  try {
    const project = await db.project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with id ${projectId} does not exist`,
      });
    }

    const updateData = {};
    const { title, description, status, userId } = req.body;

    if (title !== undefined) {
      const titleValidation = validators.isValidString(title, "Title");
      if (!titleValidation.valid) {
        return res.status(400).json({
          success: false,
          message: titleValidation.message,
        });
      }
      updateData.title = title;
    }

    if (description !== undefined) {
      const descValidation = validators.isValidString(
        description,
        "Description"
      );
      if (!descValidation.valid) {
        return res.status(400).json({
          success: false,
          message: descValidation.message,
        });
      }
      updateData.description = description;
    }

    if (status !== undefined) {
      const statusValidation = validators.isValidString(status, "Status");
      if (!statusValidation.valid) {
        return res.status(400).json({
          success: false,
          message: statusValidation.message,
        });
      }
      updateData.status = status;
    }

    if (userId !== undefined) {
      const userIdValidation = validators.isValidNumber(userId, "User ID");
      if (!userIdValidation.valid) {
        return res.status(400).json({
          success: false,
          message: userIdValidation.message,
        });
      }
      updateData.userId = userId;
    }

    // Không có field nào được cung cấp
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "At least one field (title, description, status, userId) must be provided to update",
      });
    }

    await db.project.update(updateData, {
      where: { id: projectId },
    });

    const updatedProject = await db.project.findByPk(projectId);
    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({
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
    return res.status(404).json({
      success: false,
      message: "Project ID is required",
    });
  }
  try {
    const project = await db.project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
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
