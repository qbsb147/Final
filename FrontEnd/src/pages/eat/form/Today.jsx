import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Subtitle, Text, Title } from '../../../styles/Typography';

const Today = () => {
  const [dateString, setDateString] = useState('');
  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`; // "2025-06-17"
  };
  useEffect(() => {
    const today = new Date();
    setDateString(formatDate(today));
  }, []);

  return (
    <Div>
      <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8.03882 2.01416C7.48682 2.01416 7.03882 2.46216 7.03882 3.01416C4.82782 3.01416 3.00781 4.80716 3.00781 7.01416V9.01416L3.03882 17.0142C3.03882 19.2202 4.82982 21.0142 7.03882 21.0142H17.0388C19.2478 21.0142 21.0388 19.2232 21.0388 17.0142L21.0078 9.01416V7.01416C21.0078 4.80316 19.2458 3.01416 17.0388 3.01416C17.0388 2.46216 16.5918 2.01416 16.0388 2.01416C15.4868 2.01416 15.0388 2.46216 15.0388 3.01416H9.03882C9.03882 2.46216 8.59182 2.01416 8.03882 2.01416ZM7.03882 5.01416C7.03882 5.56616 7.48682 6.01416 8.03882 6.01416C8.59182 6.01416 9.03882 5.56616 9.03882 5.01416H15.0388C15.0388 5.56616 15.4868 6.01416 16.0388 6.01416C16.5918 6.01416 17.0388 5.56616 17.0388 5.01416C18.1358 5.01416 19.0078 5.90216 19.0078 7.01416V8.01416C17.0838 8.01416 6.93181 8.01416 5.00781 8.01416V7.01416C5.00781 5.91716 5.92682 5.01416 7.03882 5.01416ZM5.00781 10.0142C6.93181 10.0142 17.0838 10.0142 19.0078 10.0142L19.0388 17.0142C19.0388 18.1152 18.1438 19.0142 17.0388 19.0142H7.03882C5.93482 19.0142 5.03882 18.1192 5.03882 17.0142L5.00781 10.0142Z"
          fill="#2A343D"
        />
      </svg>
      <Subtitle>{dateString}</Subtitle>
    </Div>
  );
};

export default Today;

const Div = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;
