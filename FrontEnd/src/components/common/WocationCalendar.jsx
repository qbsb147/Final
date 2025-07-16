import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ko from 'date-fns/locale/ko';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Swal from 'sweetalert2';
import SwalStyles from '../../styles/SwalStyles';

const locales = {
  ko: ko,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const WorcationCalendar = ({ events, fullDates = {}, onSelectSlot }) => {
  //날짜별 스타일 변경: 마감 날짜는 회색 처리
  const dayPropGetter = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    if (fullDates[dateStr]) {
      return {
        style: {
          backgroundColor: '#f2f2f2', // 마감일은 회색
          color: '#999',
          cursor: 'not-allowed',
        },
      };
    }
    return {};
  };

  //마감 날짜는 선택 이벤트 무시
  const handleSelectSlot = (slotInfo) => {
    const dateStr = format(slotInfo.start, 'yyyy-MM-dd');
    if (fullDates[dateStr]) {
      Swal.fire({
        icon: 'warning',
        title: '마감된 날짜입니다',
        text: '해당 날짜는 더 이상 신청이 불가능합니다.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    onSelectSlot(slotInfo);
  };

  return (
    <div>
      <SwalStyles />
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        views={['month']}
        defaultView="month"
        dayPropGetter={dayPropGetter} //날짜 스타일 처리
        popup
      />
    </div>
  );
};

export default WorcationCalendar;
