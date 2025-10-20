// src/components/FreeTimeModal/FreeTimeModal.jsx
import React, { useState } from "react";
import { Modal, Checkbox, TimePicker, Button } from "antd";
import dayjs from "dayjs";
import "./FreeTimeModal.css";
import { useNavigate } from "react-router-dom";
import ThanksModal from "./ThanksModal";
const { RangePicker } = TimePicker;

export default function FreeTimeModal({
  open,
  date,            // dayjs instance
  onCancel,
  onConfirm,
}) {
  const [fullDay, setFullDay] = useState(true);
  const [useRange, setUseRange] = useState(false);
  const [range, setRange] = useState([dayjs().hour(9).minute(0), dayjs().hour(18).minute(0)]);


  const handleOk = () => {
    onConfirm?.({
      date,
      fullDay,
      useRange,
      range: useRange ? range : null,
    });
  };

  return (
    <>
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={880}
      destroyOnClose
      maskClosable={false}
      className="freetime-modal"
      title={null}
    >
      <div className="ftm-body">
        {/* Panel trái gradient */}
        <div className="ftm-left">
          <h2>Thêm thời gian rảnh</h2>
          <p>
            Hãy chọn đúng thời gian bạn thật sự rảnh để hệ thống đề xuất công
            việc phù hợp nhất!
          </p>
        </div>

        {/* Panel phải nội dung */}
        <div className="ftm-right">
          <div className="ftm-date">
            Ngày: {date ? date.format("[Thứ] d, DD/MM") : "--/--"}
          </div>

          <div className="ftm-options">
            <Checkbox
              checked={fullDay}
              onChange={(e) => {
                setFullDay(e.target.checked);
                if (e.target.checked) setUseRange(false);
              }}
            >
              Rảnh nguyên ngày
            </Checkbox>

            <Checkbox
              checked={useRange}
              onChange={(e) => {
                setUseRange(e.target.checked);
                if (e.target.checked) setFullDay(false);
              }}
              style={{ marginTop: 12 }}
            >
              Chọn khung giờ cụ thể
            </Checkbox>

            <div className={`ftm-range ${useRange ? "show" : "hide"}`}>
              <RangePicker
                value={range}
                onChange={(val) => setRange(val)}
                format="HH:mm"
                minuteStep={15}
                allowClear={false}
              />
            </div>
          </div>

          <div className="ftm-actions">
            <Button onClick={onCancel}>Hủy bỏ</Button>
            <Button type="primary" onClick={handleOk}>
              Xác nhận
            </Button>
          </div>
        </div>
      </div>
    </Modal>
    
    </>
  );
}
