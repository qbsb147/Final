import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import { ko } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

function ApplySampleCalendar({
  selectedDates = [new Date(), new Date()],
  setSelectedDates = () => {},
  datePeopleMap = {},
  fullDates = {},
}) {
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

  // 날짜 셀: 날짜 숫자 + 인원/마감 (간격 넓게)
  const renderDayContent = (date) => {
    const d = date.toISOString().slice(0, 10);
    // 선택된 날짜인지 확인
    const isSelected = state[0] && state[0].startDate && state[0].endDate &&
      date >= state[0].startDate && date <= state[0].endDate;
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 0,
      }}>
        <span style={{ color: isSelected ? '#fff' : 'black', fontSize: 16 }}>{date.getDate()}</span>
        {fullDates[d] ? (
          <span style={{ color: isSelected ? '#fff' : 'red', fontSize: 12 }}>마감</span>
        ) : datePeopleMap[d] ? (
          <span style={{ color: isSelected ? '#fff' : 'blue', fontSize: 12 }}>
            {datePeopleMap[d].reserved} / {datePeopleMap[d].max}
          </span>
        ) : <span style={{ height: 14 }}></span>}
      </div>
    );
  };

  return (
    <div
      style={{
        width: 800,
        minWidth: 800,
        maxWidth: 800,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        padding: 20,
      }}
    >
      <DateRange
        editableDateInputs={true}
        onChange={(item) => {
          setState([item.selection]);
          setSelectedDates([item.selection.startDate, item.selection.endDate]);
        }}
        moveRangeOnFirstSelection={false}
        ranges={state}
        locale={ko}
        minDate={new Date()}
        dayContentRenderer={renderDayContent}
      />
      <style>
        {`
          .rdrDay {
            height: 75px !important;
            min-height: 75px !important;
            max-height: 80px !important;
            min-width: 100px !important;
          }
          .rdrDayNumber span {
            font-size: 18px !important;
          }
          .rdrMonth {
            width: 100% !important;
          }
          .rdrDays {
            min-height: unset !important;
            row-gap: 0 !important;
            gap: 0 !important;
          }
          .rdrWeekDays, .rdrDays, .rdrMonth {
            margin-bottom: 0 !important;
          }
        `}
      </style>
    </div>
  );
}

export default ApplySampleCalendar;
