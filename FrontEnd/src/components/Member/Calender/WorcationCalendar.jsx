import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { format, parse, startOfWeek, getDay, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { companyEmployee } from '../../../api/company';
import useAuthStore from '../../../store/authStore';

const locales = { ko };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

const formatDateToLocalString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const WorcationCalendar = () => {
  const [events, setEvents] = useState([]);
  const { loginUser } = useAuthStore();

  const fetchEvents = async () => {
    try {
      const data = await companyEmployee.CalendarEmployee(loginUser.company_no);

      const dateMap = {};

      data.forEach((item) => {
        const start = new Date(item.start_date);
        const end = new Date(item.end_date);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateKey = formatDateToLocalString(d);

          if (!dateMap[dateKey]) dateMap[dateKey] = [];

          dateMap[dateKey].push({
            name: item.user_name,
            location: item.worcation_place,
          });
        }
      });

      const formatted = Object.entries(dateMap).map(([dateKey, users]) => {
        const [year, month, day] = dateKey.split('-');
        const date = new Date(year, month - 1, day);

        return {
          title: `워케이션 인원: ${users.length}명`,
          start: date,
          end: date,
          allDay: true,
          resource: users,
          // backgroundColor 제거
        };
      });

      setEvents(formatted);
    } catch (error) {
      console.error('워케이션 일정 불러오기 실패:', error);
    }
  };

  const handleSelectEvent = (event) => {
    if (event.resource.length > 1) {
      const details = event.resource.map((user) => `이름: ${user.name} - 장소: ${user.location}`).join('\n');
      alert(details);
    } else {
      const user = event.resource[0];
      alert(`이름: ${user.name} - 장소: ${user.location}`);
    }
  };

  const handleSelectSlot = ({ start }) => {
    const selectedDate = startOfDay(new Date(start));

    const selectedEvents = events.filter((event) =>
      isWithinInterval(selectedDate, {
        start: startOfDay(new Date(event.start)),
        end: endOfDay(new Date(event.end)),
      })
    );

    if (selectedEvents.length === 0) {
      alert('선택한 날짜에 워케이션 신청자가 없습니다.');
      return;
    }

    const users = selectedEvents.flatMap((ev) => ev.resource);
    const uniqueUsers = Array.from(new Map(users.map((u) => [u.name, u])).values());
    const details = uniqueUsers.map((user) => `이름: ${user.name} - 장소: ${user.location}`).join('\n');
    alert(details);
  };

  const eventPropGetter = () => {
    return {
      style: {
        backgroundColor: 'transparent',
        borderRadius: '5px',
        opacity: 0.9,
        color: 'black',
        border: 'none',
        fontSize: 10, // 글자 크기를 좀 더 작게 조절
        overflow: 'visible', // 글자가 잘리지 않도록 변경
        whiteSpace: 'normal', // 줄바꿈 허용
        textOverflow: 'clip', // 생략 부호 없이 그대로 표시
        cursor: 'pointer',
        paddingLeft: 4,
        paddingRight: 4,
      },
    };
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div style={{ height: '100%', width: '100%', margin: '0 auto' }}>
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        draggableAccessor={() => false}
        onEventDrop={() => {}}
        views={['month']}
        popup
        messages={{ more: (count) => `+${count}명` }}
        resizable={false}
        eventPropGetter={eventPropGetter}
        toolbar={false}
      />
    </div>
  );
};

export default WorcationCalendar;
