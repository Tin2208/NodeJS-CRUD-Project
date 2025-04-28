"use client";

import { useState, useEffect } from "react";
import { Table, Button, Input, Space, Typography, notification } from "antd";
import { EyeOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { MdEdit } from "react-icons/md";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/UserApi";
import CreateUserModal from "./CreateUserModal";
import UserDetailsModal from "./UserDetailsModal";
import { ModalDelete } from "./ModalDelete";
import type { User } from "../types/User";

const { Title, Text } = Typography;
const { Search } = Input;

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModal, setIsModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [api, contextHolder] = notification.useNotification();
  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      console.log("getAllUsers response:", response);
      if (response.success) {
        setUsers(response.data);
      } else {
        setError(response.message || "Failed to fetch users.");
        api.error({
          message: "Error",
          description: response.message || "Unable to fetch user list.",
          placement: "bottomRight",
          duration: 3,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("An unexpected error occurred.");
      api.error({
        message: "Error",
        description: "An unexpected error occurred while fetching users.",
        placement: "bottomRight",
        duration: 3,
      });
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [api]);

  const handleSubmit = async (user: User, mode: "create" | "edit") => {
    try {
      const userToSubmit = {
        ...(editingUser ? { id: editingUser.id } : {}),
        ...user,
        name: user.name.replace(/\s+/g, " ").trim(),
        email: user.email.replace(/\s+/g, " ").trim(),
        age: user.age ?? 0,
      };

      if (mode === "edit" && editingUser) {
        const isUnchanged =
          userToSubmit.name === editingUser.name &&
          userToSubmit.email === editingUser.email &&
          userToSubmit.age === editingUser.age;

        if (isUnchanged) {
          api.info({
            message: "No Changes",
            description: "No modifications were made to the user.",
            placement: "bottomRight",
            duration: 3,
          });
          return;
        }
      }

      const isEmailDuplicate = users.some(
        (u) =>
          u.email.toLowerCase() === userToSubmit.email.toLowerCase() &&
          u.id !== editingUser?.id
      );

      if (isEmailDuplicate) {
        api.error({
          message: "Error",
          description: "Email already exists. Please use a different email.",
          placement: "bottomRight",
          duration: 3,
        });
        return;
      }

      let response;
      if (mode === "create") {
        response = await createUser(userToSubmit);
      } else {
        response = await updateUser(userToSubmit);
      }

      if (response.success) {
        if (mode === "create") {
          setUsers((prevUsers) => [...prevUsers, response.data]);
          api.success({
            message: "Success",
            description: "User created successfully!",
            placement: "bottomRight",
            duration: 3,
          });
          fetchUsers();
        } else {
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.id === response.data.id ? response.data : u
            )
          );
          api.success({
            message: "Success",
            description: "User updated successfully!",
            placement: "bottomRight",
            duration: 3,
          });
        }

        setIsModal(false);
        setEditingUser(null);
      } else {
        api.error({
          message: "Error",
          description:
            response.message ||
            `Unable to ${mode === "create" ? "create" : "update"} user.`,
          placement: "bottomRight",
          duration: 3,
        });
      }
    } catch (error) {
      console.error(`Error in ${mode}:`, error);
      api.error({
        message: "Error",
        description: `An unexpected error occurred while ${
          mode === "create" ? "creating" : "updating"
        } user.`,
        placement: "bottomRight",
        duration: 3,
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteUser(id);
      if (response.success) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
        api.success({
          message: "Success",
          description: "User deleted successfully!",
          placement: "bottomRight",
          duration: 3,
        });
        fetchUsers();
      } else {
        api.error({
          message: "Error",
          description: response.message || "Unable to delete user.",
          placement: "bottomRight",
          duration: 3,
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      api.error({
        message: "Error",
        description: "An unexpected error occurred while deleting user.",
        placement: "bottomRight",
        duration: 3,
      });
    } finally {
      setIsModalDelete(false);
      setSelectedUserId(null);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsModal(true);
  };

  const handleViewClick = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
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
              setSelectedUserId(record.id);
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
          <Title level={2}>User Management</Title>
          <Text type="secondary">
            Manage and monitor all users in the system
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingUser(null);
            setIsModal(true);
          }}
        >
          New User
        </Button>
      </div>

      <CreateUserModal
        isOpen={isModal}
        onClose={() => {
          setIsModal(false);
          setEditingUser(null);
        }}
        onSubmit={(user) => handleSubmit(user, editingUser ? "edit" : "create")}
        initialValues={editingUser}
      />

      <div className="bg-white p-6 rounded-lg ">
        <div className="flex justify-between mb-4">
          <Title level={4} className="w-full">
            User List
          </Title>
          <Search
            placeholder="Search users..."
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-52"
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={
            filteredUsers.length > 10
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
          if (selectedUserId !== null) handleDelete(selectedUserId);
        }}
        itemName="this user"
      />

      <UserDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default UserList;
