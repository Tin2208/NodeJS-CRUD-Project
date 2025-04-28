import { Modal, Button } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

interface ModalDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  itemName?: string;
}

export function ModalDelete({
  isOpen,
  onClose,
  onDelete,
  itemName = "this item",
}: ModalDeleteProps) {
  return (
    <Modal
      title="Confirm Delete"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={425}
      centered
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "16px",
          padding: "12px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "#FFF1F0",
          }}
        >
          <ExclamationCircleFilled
            style={{ fontSize: "20px", color: "#FF4D4F" }}
          />
        </div>
        <div style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.65)" }}>
          Are you sure you want to delete {itemName}? This action cannot be
          undone.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          marginTop: "16px",
        }}
      >
        <Button onClick={onClose}>Cancel</Button>
        <Button type="primary" danger onClick={onDelete}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
