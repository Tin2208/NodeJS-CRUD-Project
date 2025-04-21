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
    const project = await db.project.findByPk(projectId, {
      include: [{ model: db.user, through: { attributes: [] } }],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with id ${projectId} not found`,
      });
    }

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
  const { title, description, status, userIds } = req.body;

  // Kiểm tra sự tồn tại và tính hợp lệ của `userIds`
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: "userIds is required and must be a non-empty array of integers.",
    });
  }

  try {
    // Kiểm tra tất cả userId có tồn tại không
    const users = await db.user.findAll({ where: { id: userIds } });
    if (users.length !== userIds.length) {
      return res.status(404).json({
        success: false,
        message: "One or more userIds do not exist.",
      });
    }

    // Tạo project
    const newProject = await db.project.create({
      title,
      description,
      status,
    });

    // Thêm userIds vào bảng trung gian
    await newProject.addUsers(userIds);

    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};

//Update project
const updateProject = async (req, res) => {
  const projectId = req.params.id;
  const { title, description, status, userIds } = req.body;

  try {
    const project = await db.project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with id ${projectId} does not exist`,
      });
    }

    if (userIds) {
      const users = await db.user.findAll({ where: { id: userIds } });
      if (users.length !== userIds.length) {
        return res.status(404).json({
          success: false,
          message: "One or more userIds do not exist",
        });
      }

      // Cập nhật userIds trong bảng trung gian
      await project.setUsers(userIds);
    }

    await project.update({ title, description, status });

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
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
