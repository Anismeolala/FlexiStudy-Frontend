// src/components/ThanksModal/ThanksModal.jsx
import React from "react";
import { Modal, Button } from "antd";
import "./ThanksModal.css";

export default function ThanksModal({ open, onClose, onGoJobs }) {
  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      width={820}
      className="thanks-modal"
      title={null}
      destroyOnClose
      maskClosable
    >
      <div className="tm-wrap">
        <h2 className="tm-title">Cảm ơn bạn đã chia sẻ thời gian rảnh.</h2>
        <p className="tm-sub">
          FlexiStudy sẽ đề xuất các công việc phù hợp nhất với lịch trình của bạn.
        </p>

        <Button className="tm-cta" onClick={onGoJobs}>
          Việc làm phù hợp với bạn
        </Button>
      </div>
    </Modal>
  );
}
