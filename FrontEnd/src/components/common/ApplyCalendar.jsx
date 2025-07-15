import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { ko } from 'date-fns/locale';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'ko': ko };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

function ReservationCalendar({ datePeopleMap = {} }) {
  // 날짜별 커스텀 셀 렌더링
  const pad = (n) => n.toString().padStart(2, '0');
  const getDateString = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  const customDateCellWrapper = ({ value, children }) => {
    const d = getDateString(value);
    let info = null;
    if (datePeopleMap && datePeopleMap[d]) {
      const { reserved, max } = datePeopleMap[d];
      info = (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}>
          <span style={{ fontSize: 14, color: 'black', marginBottom: 2 }}>{value.getDate()}</span>
          <span style={{ fontSize: 14, color: 'blue' }}>{reserved} / {max}</span>
        </div>
      );
      return (
        <div style={{ position: 'relative', height: '100%' }}>
          {info}
        </div>
      );
    }
    // 기본 날짜 셀: 날짜만 표시
    return (
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 14, color: 'black' }}>{value.getDate()}</span>
        {children}
      </div>
    );
  };

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: 600, minWidth: 400, maxWidth: 800, height: 500 }}>
        <Calendar
          localizer={localizer}
          events={[]}
          startAccessor="start"
          endAccessor="end"
          views={['month']}
          components={{
            dateCellWrapper: customDateCellWrapper,
          }}
          popup={false}
          selectable={false}
        />
      </div>
    </div>
  );
}

export default ReservationCalendar;
