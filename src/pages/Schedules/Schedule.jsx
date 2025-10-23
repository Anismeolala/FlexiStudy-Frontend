import React, { useEffect, useState } from "react";
import { Card, Button, Badge, Calendar, message, Spin } from "antd";
import {
  ClockCircleOutlined,
  CalendarOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  createAvailabilityWindowAPI,
  getAvailabilityWindowsByUserAPI,
  deleteAvailabilityWindowAPI,
} from "../../apis";
import "./Schedule.css";

const Schedule = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [schedule, setSchedule] = useState({});
  const userId  = useSelector((state) => state.user.id);
  const [loading, setLoading] = useState(false);

    const timeSlots = [
      { label: "Day Shift (9 AM - 5 PM)", start: "09:00", end: "17:00" },
      { label: "Evening Shift (2 PM - 10 PM)", start: "14:00", end: "22:00" },
      { label: "Night Shift (10 PM - 6 AM)", start: "22:00", end: "06:00" },
      { label: "Flexible Hours (All day)", start: "00:00", end: "23:59" },
    ];


  useEffect(() => {
      if (!userId) return;
      const fetchData = async () => {
        try {
          setLoading(true);
          const res = await getAvailabilityWindowsByUserAPI(userId);

          const grouped = {};
          res.result?.forEach((w) => {
            const date = w.date;

            // Chuẩn hóa format về HH:mm
            const start = dayjs(w.startTime, ["HH:mm", "HH:mm:ss"]).format("HH:mm");
            const end = dayjs(w.endTime, ["HH:mm", "HH:mm:ss"]).format("HH:mm");

            if (!grouped[date]) grouped[date] = [];
            grouped[date].push({
              id: w.id,
              start,
              end,
              note: w.note,
            });
          });
          setSchedule(grouped);
          setSelectedDates(Object.keys(grouped));
        } catch (err) {
          console.error(err);
          message.error("Không thể tải lịch rảnh");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [userId]);

  // Chọn ngày
  const handleSelect = (value) => {
    const dateStr = value.format("YYYY-MM-DD");
    if (!selectedDates.includes(dateStr)) {
      setSelectedDates([...selectedDates, dateStr]);
      setSchedule({ ...schedule, [dateStr]: [] });
    }
  };

  const handleToggleSlot = async (date, slot) => {
    const slots = schedule[date] || [];
    const existing = slots.find(
      (s) => s.start === slot.start && s.end === slot.end
    );

    // Nếu click vào Flexible Hours
    if ((slot.label || slot.note || "").includes("Flexible")) {
      if (existing) {
        // Đang bật Flexible → tắt đi
        const updated = slots.filter(
          (s) => !(s.start === slot.start && s.end === slot.end)
        );
        setSchedule({ ...schedule, [date]: updated });
        try {
          await deleteAvailabilityWindowAPI(existing.id);
        } catch (err) {
          console.error(err);
          message.error("Không thể xóa khung giờ linh hoạt");
        }
      } else {
        // Bật Flexible → xóa hết các shift khác trước
        try {
          await Promise.all(
            slots
              .filter((s) => !(s.label || s.note || "").includes("Flexible"))
              .map((s) => deleteAvailabilityWindowAPI(s.id))
          );
        } catch (err) {
          console.error(err);
        }

        const tempId = `temp-${Math.random()}`;
        const newSlot = {
          id: tempId,
          start: "00:00",
          end: "23:59",
          note: slot.label,
        };
        setSchedule({ ...schedule, [date]: [newSlot] });

        try {
          const res = await createAvailabilityWindowAPI({
            userId,
            date,
            startTime: "00:00",
            endTime: "23:59",
            note: slot.label,
          });
          setSchedule((prev) => ({
            ...prev,
            [date]: prev[date].map((s) =>
              s.id === tempId ? { ...s, id: res.result.id } : s
            ),
          }));
        } catch (err) {
          console.error(err);
          message.error("Không thể tạo khung giờ linh hoạt");
        }
      }
      return;
    }

    // Nếu chọn/huỷ các shift bình thường
    const hasFlexible = slots.some(
      (s) => (s.label || s.note || "").includes("Flexible")
    );

    if (hasFlexible) {
      message.warning("Bạn đang bật 'Flexible Hours', không thể chọn ca khác.");
      return;
    }

    if (existing) {
      // Hủy shift
      const updated = slots.filter(
        (s) => !(s.start === slot.start && s.end === slot.end)
      );
      setSchedule({ ...schedule, [date]: updated });
      try {
        await deleteAvailabilityWindowAPI(existing.id);
      } catch (err) {
        console.error(err);
        message.error("Không thể xóa khung giờ");
      }
    } else {
      // Thêm shift
      const tempId = `temp-${Math.random()}`;
      const newSlot = {
        id: tempId,
        start: slot.start,
        end: slot.end,
        note: slot.label,
      };
      setSchedule({ ...schedule, [date]: [...slots, newSlot] });
      try {
        const res = await createAvailabilityWindowAPI({
          userId,
          date,
          startTime: slot.start,
          endTime: slot.end,
          note: slot.label,
        });
        setSchedule((prev) => ({
          ...prev,
          [date]: prev[date].map((s) =>
            s.id === tempId ? { ...s, id: res.result.id } : s
          ),
        }));
      } catch (err) {
        console.error(err);
        message.error("Không thể tạo khung giờ");
      }
    }
  };


  //  Xóa ngày
  const handleRemoveDate = async (date) => {
    const slots = schedule[date] || [];
    try {
      await Promise.all(slots.map((s) => deleteAvailabilityWindowAPI(s.id)));
      const newSchedule = { ...schedule };
      delete newSchedule[date];
      setSchedule(newSchedule);
      setSelectedDates(selectedDates.filter((d) => d !== date));
      message.success("Đã xóa toàn bộ khung giờ của ngày này");
    } catch {
      message.error("Không thể xóa lịch ngày này");
    }
  };

const handleSave = async () => {
  try {
    setLoading(true);

    // Hiển thị trạng thái "đang lưu"
    message.loading({
      content: "Đang lưu lịch rảnh...",
      key: "saving",
      duration: 0,
    });

    // Mô phỏng quá trình "lưu" (đợi 1.2s)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Gọi lại fetch API để đồng bộ (nếu muốn làm thật)
    // await fetchData();

    message.success({
      content: "Đã lưu lịch rảnh thành công!",
      key: "saving",
      duration: 2,
    });
  } catch (err) {
    console.error(err);
    message.error({
      content: "Đã xảy ra lỗi khi lưu lịch rảnh.",
      key: "saving",
    });
  } finally {
    setLoading(false);
  }
};




  const totalSlots = Object.values(schedule).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  return (
    <div className="schedule-page">
      <div className="schedule-header">
        <h1>Cập nhật lịch rảnh</h1>
        <p>
          Chọn ngày và khung giờ bạn có thể làm việc để matching với công việc
          phù hợp
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <div className="schedule-grid">
          {/* Cột 1: Calendar */}
          <Card className="calendar-card">
            <h3 className="card-title">
              <CalendarOutlined /> Chọn ngày rảnh
            </h3>
            <p className="card-desc">
              Nhấp vào ngày để thêm vào danh sách lịch rảnh
            </p>
            <Calendar
              fullscreen={false}
              onSelect={handleSelect}
              disabledDate={(date) => date && date < dayjs().startOf("day")}
            />
          </Card>

          {/* Cột 2: Khung giờ */}
          <Card className="slot-card">
            <h3 className="card-title">
              <ClockCircleOutlined /> Khung giờ rảnh
            </h3>
            {selectedDates.length === 0 ? (
              <div className="empty-state">
                <CalendarOutlined className="empty-icon" />
                <p>Chưa có ngày nào được chọn</p>
              </div>
            ) : (
              <div className="slot-list">
                {selectedDates.map((date) => {
                  const slots = schedule[date] || [];
                  return (
                    <div key={date} className="slot-item">
                      <div className="slot-header">
                        <div className="slot-info">
                          <Badge
                            color="blue"
                            text={dayjs(date).format("DD/MM/YYYY")}
                          />
                          <Badge
                            count={`${slots.length} khung giờ`}
                            style={{
                              background: "#f0f0f0",
                              color: "#333",
                            }}
                          />
                        </div>
                        <Button
                          icon={<DeleteOutlined />}
                          size="small"
                          danger
                          type="text"
                          onClick={() => handleRemoveDate(date)}
                        />
                      </div>
                      {/* Khung giờ */}
                      <div className="slot-buttons">
                          {timeSlots.map((slot) => {
                            const slotsForDate = schedule[date] || [];
                            const isSelected = slotsForDate.some(
                              (s) => s.start === slot.start && s.end === slot.end
                            );

                            const hasFlexible = slotsForDate.some(
                              (s) => (s.label || s.note || "").includes("Flexible")
                            );
                            

                            return (
                              <button
                                key={`${slot.start}-${slot.end}`}
                                className={`custom-slot-btn ${isSelected ? "selected" : ""}`}
                                onClick={() => handleToggleSlot(date, slot)}
                                disabled={hasFlexible && !((slot.label || slot.note || "").includes("Flexible"))}
                              >
                                {slot.label}
                              </button>
                            );
                          })}
                        </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </div>
            )}
      {selectedDates.length > 0 && (
      <Card className="summary-card">
        <h3 className="card-title">Tóm tắt lịch rảnh</h3>
        <div className="summary-content">
          <div>
            <p>
              Tổng số ngày: <strong>{selectedDates.length}</strong>
            </p>
            <p>
              Tổng số khung giờ: <strong>{totalSlots}</strong>
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            onClick={handleSave}
            loading={loading}
          >
            💾 Lưu lịch rảnh
          </Button>
        </div>
      </Card>
    )}
    </div>
  );
};

export default Schedule;
