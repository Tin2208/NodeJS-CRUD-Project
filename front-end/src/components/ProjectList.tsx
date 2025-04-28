"use client";

import { useState, useEffect } from "react";
import { Table, Button, Input, Space, Typography, notification } from "antd";
import { EyeOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { MdEdit } from "react-icons/md";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/ProjectApi";
import CreateProjectModal from "./CreateProjectModal";
import ProjectDetailsModal from "./ProjectDetailsModal";
import { ModalDelete } from "./ModalDelete";
import type { Project } from "../types/Project";

const { Title, Text } = Typography;
const { Search } = Input;

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModal, setIsModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [api, contextHolder] = notification.useNotification();
  const fetchProjects = async () => {
    try {
      const response = await getAllProjects();
      if (response.success) {
        setProjects(response.data);
      } else {
        setError(response.message || "Failed to fetch projects.");
        api.error({
          message: "Error",
          description: response.message || "Unable to fetch project list.",
          placement: "bottomRight",
          duration: 3,
        });
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("An unexpected error occurred.");
      api.error({
        message: "Error",
        description: "An unexpected error occurred while fetching projects.",
        placement: "bottomRight",
        duration: 3,
      });
    }
  };
  useEffect(() => {
    fetchProjects();
  }, [api]);

  const handleSubmit = async (project: Project, mode: "create" | "edit") => {
    try {
      const projectToSubmit = {
        ...project,
        title: project.title.replace(/\s+/g, " ").trim(),
        description: project.description.replace(/\s+/g, " ").trim(),
        userId: project.userId || [],
      };

      if (
        mode === "edit" &&
        editingProject &&
        projectToSubmit.title === editingProject.title &&
        projectToSubmit.description === editingProject.description &&
        projectToSubmit.status === editingProject.status &&
        JSON.stringify(projectToSubmit.userId) ===
          JSON.stringify(editingProject.userId)
      ) {
        api.info({
          message: "No Changes",
          description: "No modifications were made to the project.",
          placement: "bottomRight",
          duration: 3,
        });
        return;
      }

      let response;
      if (mode === "create") {
        response = await createProject(projectToSubmit);
      } else {
        response = await updateProject(projectToSubmit);
      }

      if (response.success) {
        if (mode === "create") {
          setProjects((prevProjects) => [...prevProjects, response.data]);
          api.success({
            message: "Success",
            description: "Project created successfully!",
            placement: "bottomRight",
            duration: 3,
          });
          fetchProjects();
        } else {
          setProjects((prevProjects) =>
            prevProjects.map((proj) =>
              proj.id === project.id ? { ...proj, ...response.data } : proj
            )
          );
          api.success({
            message: "Success",
            description: "Project updated successfully!",
            placement: "bottomRight",
            duration: 3,
          });
          fetchProjects();
        }
        setIsModal(false);
        setEditingProject(null);
      } else {
        api.error({
          message: "Error",
          description: response.message || `Failed to ${mode} project.`,
          placement: "bottomRight",
          duration: 3,
        });
      }
    } catch (error) {
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} project:`,
        error
      );
      api.error({
        message: "Error",
        description: `An unexpected error occurred while ${
          mode === "create" ? "creating" : "updating"
        } the project.`,
        placement: "bottomRight",
        duration: 3,
      });
    }
  };

  const handleEditClick = (project: Project) => {
    console.log("Editing Project:", project);
    const projectToEdit = {
      ...project,
      userId: Array.isArray(project.users)
        ? project.users.map((user) => user.id)
        : [],
    };
    setEditingProject(projectToEdit);
    setIsModal(true);
  };

  const handleViewClick = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteProject(id);
      if (response.success) {
        setProjects((prev) => prev.filter((proj) => proj.id !== id));
        api.success({
          message: "Success",
          description: "Project deleted successfully!",
          placement: "bottomRight",
          duration: 3,
        });
        // fetchProjects();
      } else {
        api.error({
          message: "Error",
          description: response.message || "Failed to delete project.",
          placement: "bottomRight",
          duration: 3,
        });
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      api.error({
        message: "Error",
        description: "An unexpected error occurred while deleting project.",
        placement: "bottomRight",
        duration: 3,
      });
    } finally {
      setIsModalDelete(false);
      setSelectedProjectId(null);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchText.toLowerCase()) ||
      project.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true, // Hiển thị dấu "..." nếu nội dung quá dài
      width: 200, // Đặt chiều rộng tối đa là 200px
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true, // Hiển thị dấu "..." nếu nội dung quá dài
      width: 200, // Đặt chiều rộng tối đa là 200px
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let colorClasses = "";

        switch (status.toLowerCase()) {
          case "in progress":
            colorClasses = "text-yellow-600 bg-yellow-200";
            break;
          case "pending":
            colorClasses = "text-orange-600 bg-orange-200";
            break;
          case "completed":
            colorClasses = "text-green-600 bg-green-200";
            break;
          default:
            colorClasses = "text-gray-600 bg-gray-200";
        }

        return (
          <span
            className={`px-3 py-1 rounded-full font-medium text-sm capitalize ${colorClasses}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: "Members",
      dataIndex: "users",
      key: "users",
      render: (users: { id: number; name: string }[]) => {
        if (Array.isArray(users) && users.length > 0) {
          return users.map((user) => user.name).join(", ");
        }
        return "No members assigned";
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Project) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            type="link"
            onClick={() => handleViewClick(record)}
          />
          <Button
            icon={<MdEdit />}
            type="link"
            style={{ color: "#faad14" }}
            onClick={() => handleEditClick(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            type="link"
            danger
            onClick={() => {
              setSelectedProjectId(record.id);
              setIsModalDelete(true);
            }}
          />
        </Space>
      ),
    },
  ];

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8 w-full">
      {contextHolder}
      <div className="flex justify-between mb-6">
        <div>
          <Title level={2}>Project Management</Title>
          <Text type="secondary">
            Manage and monitor all projects in the system
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingProject(null);
            setIsModal(true);
          }}
        >
          New Project
        </Button>
      </div>

      <CreateProjectModal
        isOpen={isModal}
        onClose={() => {
          setIsModal(false);
          setEditingProject(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editingProject}
      />

      <div className="bg-white p-6 rounded-lg">
        <div className="flex justify-between mb-4">
          <Title level={4} className="w-full">
            Project List
          </Title>
          <Search
            placeholder="Search projects..."
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-52"
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredProjects}
          rowKey="id"
          scroll={{ x: "max-content" }}
          // className="no-wrap-table overflow-x-auto"
          pagination={
            filteredProjects.length > 10
              ? {
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} entries`,
                }
              : false
          }
        />
      </div>

      <ModalDelete
        isOpen={isModalDelete}
        onClose={() => setIsModalDelete(false)}
        onDelete={() => {
          if (selectedProjectId !== null) handleDelete(selectedProjectId);
        }}
        itemName="this project"
      />

      <ProjectDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        project={selectedProject}
      />
    </div>
  );
};

export default ProjectList;
