import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Calendar.css'; // Chứa CSS cho lịch

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [slotsData, setSlotsData] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu slot từ API khi tháng thay đổi
    fetchAvailableSlots();
  }, [currentDate]);

  const fetchAvailableSlots = async () => {
    const yearMonth = currentDate.toISOString().slice(0, 7); // Định dạng YYYY-MM
    const response = await axios.get(`http://localhost:5000/api/schedule/${yearMonth}`);
    setSlotsData(response.data);
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Số ngày trong tháng hiện tại
    const daysArray = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dayString = day < 10 ? `0${day}` : `${day}`;
      const slotsForDay = slotsData[dayString] || [];
      const isAvailable = slotsForDay.length > 0;

      daysArray.push(
        <div
          key={day}
          className={`day ${!isAvailable ? 'disabled' : ''}`}
          onClick={() => isAvailable && selectDay(dayString)}
        >
          {day}
        </div>
      );
    }
    return daysArray;
  };

  const selectDay = (day) => {
    setSelectedDay(day);
    setAvailableSlots(slotsData[day] || []);
  };

  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    setCurrentDate(new Date(prevMonth));
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    setCurrentDate(new Date(nextMonth));
  };

  return (
    <div className="calendar-container">
      <div className="header">
        <button onClick={goToPreviousMonth}>&lt;</button>
        <h2>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={goToNextMonth}>&gt;</button>
      </div>

      <div className="days-grid">
        {renderDays()}
      </div>

      {selectedDay && (
        <div className="slots">
          <h3>Khung giờ có sẵn cho ngày {selectedDay}:</h3>
          {availableSlots.length > 0 ? (
            availableSlots.map((slot, index) => <div key={index} className="slot">{slot}</div>)
          ) : (
            <p>Không có khung giờ khả dụng.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;
