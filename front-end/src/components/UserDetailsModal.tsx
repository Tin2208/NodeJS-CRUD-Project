import type React from "react";
import { Modal, Descriptions, Typography, Avatar, Divider } from "antd";
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { User } from "../types/User";

const { Title } = Typography;

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  if (!user) return null;

  return (
    <Modal
      title={<Title level={4}>User Details</Title>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div className="flex items-center gap-4 mb-6">
        <Avatar size={64} icon={<UserOutlined />} />
        <div>
          <Title level={4} style={{ margin: 0 }}>
            {user.name}
          </Title>
          <div className="flex items-center gap-2 text-gray-500">
            <MailOutlined />
            <span>{user.email}</span>
          </div>
        </div>
      </div>

      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
        <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        {user.age && (
          <Descriptions.Item label="Age">{user.age}</Descriptions.Item>
        )}
      </Descriptions>

      <Divider orientation="left">Additional Information</Divider>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <CalendarOutlined />
          <span>
            Created:{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarOutlined />
          <span>
            Updated:{" "}
            {user.updatedAt
              ? new Date(user.updatedAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;
