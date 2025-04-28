import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { User } from "../types/User";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: User, mode: "create" | "edit") => Promise<void>;
  initialValues?: User | null;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = async (values: {
    id: number;
    name: string;
    email: string;
    age: number;
  }) => {
    const mode = initialValues ? "edit" : "create";
    const userToSubmit = {
      ...values,
      ...(initialValues?.id ? { id: initialValues.id } : {}),
    };
    await onSubmit(userToSubmit, mode);
  };

  return (
    <Modal
      title={initialValues ? "Edit User" : "Create User"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter the user's name!" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter the user's email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>
        <Form.Item
          name="age"
          label="Age"
          rules={[{ required: true, message: "Please enter the user's age!" }]}
        >
          <Input type="number" placeholder="Enter age" />
        </Form.Item>
        <Form.Item>
          <Button key="cancel" onClick={onClose}>
            Cancel
          </Button>
          ,
          <Button type="primary" htmlType="submit">
            {initialValues ? "Save Changes" : "Create User"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
