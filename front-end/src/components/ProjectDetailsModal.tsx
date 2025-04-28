import type React from "react";
import { Modal, Descriptions, Tag, Typography, Avatar, Divider } from "antd";
import type { Project } from "../types/Project";
import {
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "success";
    case "in progress":
      return "processing";
    case "pending":
      return "warning";
    default:
      return "default";
  }
};

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  if (!project) return null;

  return (
    <Modal
      title={<Title level={4}>Project Details</Title>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="ID">{project.id}</Descriptions.Item>
        <Descriptions.Item label="Title">{project.title}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {project.description}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(project.status)}>{project.status}</Tag>
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Team Members</Divider>

      {Array.isArray(project.users) && project.users.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {project.users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 border border-gray-200 p-2 rounded"
            >
              <Avatar icon={<UserOutlined />} />
              <span>{user.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No members assigned to this project</div>
      )}

      <Divider orientation="left">Additional Information</Divider>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <CalendarOutlined />
          <span>
            Created:{" "}
            {project.createdAt
              ? new Date(project.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarOutlined />
          <span>
            Updated:{" "}
            {project.updatedAt
              ? new Date(project.updatedAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
        {project.completedAt && (
          <div className="flex items-center gap-2">
            <CheckCircleOutlined />
            <span>
              Completed: {new Date(project.completedAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ProjectDetailsModal;
