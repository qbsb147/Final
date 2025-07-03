import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import { ko } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

function ReservationCalendar({ selectedDates, setSelectedDates, onConfirm }) {
  const [state, setState] = useState([
    {
      startDate: selectedDates[0],
      endDate: selectedDates[1],
      key: 'selection',
    },
  ]);

  useEffect(() => {
    setState([
      {
        startDate: selectedDates[0],
        endDate: selectedDates[1],
        key: 'selection',
      },
    ]);
  }, [selectedDates]);

  const handleChange = (item) => {
    if (
      item.selection.startDate &&
      item.selection.endDate &&
      item.selection.startDate.getTime() === item.selection.endDate.getTime()
    ) {
      setState([
        {
          startDate: item.selection.startDate,
          endDate: item.selection.endDate,
          key: 'selection',
        },
      ]);
      setSelectedDates([item.selection.startDate, item.selection.endDate]);
      return;
    }
    setState([item.selection]);
    setSelectedDates([item.selection.startDate, item.selection.endDate]);
  };

  return (
    <div>
      <DateRange
        editableDateInputs={true}
        onChange={handleChange}
        moveRangeOnFirstSelection={false}
        ranges={state}
        locale={ko}
        minDate={new Date()}
      />
      <div className="reservation-calendar-confirm-btn-wrap">
        <button
          className="reservation-calendar-confirm-btn"
          onClick={() => onConfirm && onConfirm([state[0].startDate, state[0].endDate])}
        >
          확인
        </button>
      </div>
    </div>
  );
}

export default ReservationCalendar;
