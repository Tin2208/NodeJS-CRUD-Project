import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import { getAllUsers } from "../api/UserApi";
import { Project } from "../types/Project";

const { TextArea } = Input;
const { Option } = Select;

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Project, mode: "create" | "edit") => Promise<void>;
  initialValues?: Project | null;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response.success && Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          message.error("Failed to fetch users.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("An unexpected error occurred while fetching users.");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (initialValues && users.length > 0) {
        requestAnimationFrame(() => {
          form.setFieldsValue({
            title: initialValues.title,
            description: initialValues.description,
            status: initialValues.status,
            userId: Array.isArray(initialValues.userId)
              ? initialValues.userId
              : [],
          });
        });
      } else {
        form.resetFields();
      }
    }
  }, [initialValues, users, form, isOpen]);

  return (
    <Modal
      title={initialValues ? "Edit Project" : "Create New Project"}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {initialValues ? "Save Changes" : "Create Project"}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="create_project_form"
        onFinish={(values) => {
          const mode = initialValues ? "edit" : "create";
          onSubmit({ ...values, id: initialValues?.id }, mode);
        }}
      >
        <Form.Item
          name="title"
          label="Project Title"
          rules={[{ required: true, message: "Please enter project title!" }]}
        >
          <Input placeholder="Enter project title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "Please enter project description!" },
          ]}
        >
          <TextArea rows={3} placeholder="Enter project description" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select status!" }]}
        >
          <Select placeholder="Select status">
            <Option value="pending">Pending</Option>
            <Option value="in progress">In Progress</Option>
            <Option value="completed">Completed</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="userId"
          label="Members"
          rules={[
            { required: true, message: "Please select at least one member!" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select members"
            style={{ width: "100%" }}
            optionFilterProp="children"
            allowClear
            notFoundContent={users.length === 0 ? "No users available" : null}
            showSearch
          >
            {users.map((user) => (
              <Option key={user.id} value={user.id}>
                {user.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProjectModal;
