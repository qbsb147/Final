import React from 'react';
import { Calendar } from 'react-date-range';
import { ko } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

function ApplySampleCalendar({
  selectedDates = [new Date(), new Date()],
  setSelectedDates = () => {},
  datePeopleMap = {},
  fullDates = {},
}) {
  // 날짜 셀: 날짜 숫자 + 인원/마감 (간격 넓게)
  const renderDayContent = (date) => {
    const d = date.toISOString().slice(0, 10);
    const reserved = datePeopleMap[d]?.reserved ?? 0;
    let max = datePeopleMap[d]?.max ?? 0;
    if (max === 0) max = 30; // max가 0이면 30으로 대체
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 0,
      }}>
        <span style={{ fontSize: 16 }}>{date.getDate()}</span>
        {fullDates[d] ? (
          <span style={{ color: 'red', fontSize: 12 }}>마감</span>
        ) : datePeopleMap[d] ? (
          <span style={{ color: 'blue', fontSize: 12 }}>
            {reserved} / {max}
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
      <Calendar
        locale={ko}
        minDate={new Date()}
        dayContentRenderer={renderDayContent}
        onChange={() => {}}
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
            color: black !important;
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
          /* hover 효과 제거 */
        `}
      </style>
    </div>
  );
}

export default ApplySampleCalendar;
