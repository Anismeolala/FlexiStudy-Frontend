import React, { useMemo, useState } from "react";
import { Layout, Calendar, Card, Checkbox, Button } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  DownOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import "dayjs/locale/vi";
import "./Schedules.css";
import FreeTimeModal from "./ModalFreeTime/FreeTimeModal";
import { useNavigate } from "react-router-dom";
import ThanksModal from "./ModalFreeTime/ThanksModal";
dayjs.extend(isoWeek);
dayjs.locale("vi");

const HOURS = Array.from({ length: 16 }, (_, i) => 7 + i); // 7 -> 22 (10PM)

function formatHour(h) {
  const ampm = h < 12 ? "AM" : "PM";
  const display = ((h + 11) % 12) + 1; // 0->12
  return `${display} ${ampm}`;
}

export default function ScheduleSelector() {
  const [current, setCurrent] = useState(dayjs()); // ngày đang xem

  // Lấy thứ Hai đầu tuần (ISO week: T2 là 1)
  const startOfWeek = useMemo(() => current.isoWeekday(1), [current]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pickedDate, setPickedDate] = useState(null);


  const [thanksOpen, setThanksOpen] = useState(false);
  const navigate = useNavigate();

  const openForDate = (d) => {
    setPickedDate(d);
    setModalOpen(true);
  };

  const handleConfirm = (payload) => {
    // TODO: lưu dữ liệu payload (date, fullDay / range)
    // console.log(payload);
    setModalOpen(false);
        setThanksOpen(true);  // <-- mở modal cảm ơn
  };

    const handleConfirmThank = (payload) => {
    // TODO: lưu payload (date, fullDay/useRange, range)
    setModalOpen(false);

  };

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day")),
    [startOfWeek]
  );

  const isToday = (d) => d.isSame(dayjs(), "day");

  const goPrevWeek = () => setCurrent((d) => d.subtract(1, "week"));
  const goNextWeek = () => setCurrent((d) => d.add(1, "week"));
  const goThisWeek = () => setCurrent(dayjs());
  
  const goJobs = () => {
    setThanksOpen(false);
    navigate("/jobs"); // hoặc route bạn muốn
  };
  return (
    <Layout className="sched-root">
      {/* Header xanh */}
      <div className="sched-topbar">
        <div className="sched-topbar-inner">
          <div className="sched-title">
            Chọn thời gian bạn có thể làm việc trong tuần
          </div>
          <div className="sched-right" />
        </div>
      </div>

      {/* Thân trang */}
      <div className="sched-body">
        {/* Sidebar trái */}
        <aside className="sched-sidebar">
          <Card bordered={false} className="sched-mini-cal">
            <Calendar
              fullscreen={false}
              value={current}
              onSelect={(d) => setCurrent(d)}
              headerRender={({ value, onChange }) => {
                const prev = () => onChange(value.subtract(1, "month"));
                const next = () => onChange(value.add(1, "month"));
                return (
                  <div className="mini-header">
                    <Button type="text" icon={<LeftOutlined />} onClick={prev} />
                    <div className="mini-title">
                      {value.format("[Tháng] M")}
                    </div>
                    <Button type="text" icon={<RightOutlined />} onClick={next} />
                  </div>
                );
              }}
            />
          </Card>

          <Card bordered={false} className="sched-options" title="Chi tiết lịch">
            <Checkbox defaultChecked> Lịch rảnh đã chọn</Checkbox>
            <br />
            <Checkbox defaultChecked> Lịch làm thêm</Checkbox>

            <div className="sched-subtitle">Tuỳ chọn lịch hiển thị</div>
            <Checkbox> Chỉ hiển thị giờ rảnh</Checkbox>
            <br />
            <Checkbox> Chỉ hiển thị lịch làm việc</Checkbox>
          </Card>
        </aside>

        <main className="sched-week">
  {/* thanh điều hướng tuần */}
  <div className="week-toolbar">
    <Button onClick={goThisWeek}>Tuần này</Button>
    <div className="week-center">
      <Button type="text" icon={<LeftOutlined />} onClick={goPrevWeek} />
      <span className="week-label">{startOfWeek.format("D MMM, YYYY")}</span>
      <Button type="text" icon={<RightOutlined />} onClick={goNextWeek} />
    </div>
    <Button>
      Tuần <DownOutlined />
    </Button>
  </div>

  {/* GRID: 1 cột giờ + 7 cột ngày; 1 hàng header + N hàng giờ */}
  <div className="sched-grid">
    {/* Ô trống góc trái trên (header của cột giờ) */}
    <div className="corner sticky-top sticky-left" />

     {/* Header 7 ngày: CLICK mở modal */}
          {days.map((d) => (
            <div
              key={`head-${d}`}
              className="day-head sticky-top day-clickable"
              onClick={() => openForDate(d)}
            >
              <div className="weekday">
                {["T2","T3","T4","T5","T6","T7","CN"][(d.isoWeekday()+6)%7]}
              </div>
              <div className={`date-badge ${isToday(d) ? "is-today" : ""}`}>
                {d.date()}
              </div>
            </div>
          ))}

          {/* Hàng giờ + ô lưới: CLICK vào ô cũng mở modal theo ngày của cột */}
          {HOURS.map((h) => (
            <React.Fragment key={`row-${h}`}>
              <div className="time-cell sticky-left">{formatHour(h)}</div>
              {days.map((d) => (
                <div
                  key={`${d}-${h}`}
                  className="grid-cell day-clickable"
                  onClick={() => openForDate(d)}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </main>
{/* MODAL */}
      <FreeTimeModal
        open={modalOpen}
        date={pickedDate}
        onCancel={() => setModalOpen(false)}
        onConfirm={handleConfirm}
      />

      <ThanksModal
        open={thanksOpen}
        onClose={() => setThanksOpen(false)}
        onGoJobs={goJobs}
      />
      </div>
    </Layout>
  );
}
