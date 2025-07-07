import React from 'react';
import styled from 'styled-components';
import { ko } from 'date-fns/locale';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// styled-components 사용 (예시로 래핑한 container)
const Wrapper = styled.div`
  .MuiInputBase-root {
    font-family: inherit;
  }

  .MuiOutlinedInput-input {
    padding: 10px 14px;
  }
`;

const getStylesByVariant = (variant) => {
  switch (variant) {
    case 'yellow':
      return {
        width: '400px',
        height: '52.41px',
        background: '#fff',
        borderRadius: '10px',
        border: '3px solid #ffeb8c',
        boxShadow: '4px 4px 4px rgba(0,0,0,0.25)',
        color: 'black',
        '& input': {
          padding: '10px 14px',
        },
      };
    default:
      return {
        width: 400,
        background: '#fff',
        borderRadius: '10px',
        border: '3px solid #ffeb8c',
        boxShadow: '4px 4px 4px rgba(0,0,0,0.25)',
        color: 'black',
        '& input': {
          padding: '10px 14px',
        },
      };
  }
};

const CustomDatePicker = ({ selected, onChange, variant = 'yellow' }) => {
  return (
    <Wrapper>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
        <DatePicker
          label="날짜 선택"
          value={selected}
          onChange={onChange}
          views={['year', 'month', 'day']}
          format="yyyy년 MM월 dd일"
          slotProps={{
            textField: {
              placeholder: '날짜를 선택해주세요',
              size: 'small',
              InputProps: {
                sx: getStylesByVariant(variant),
              },
            },
          }}
        />
      </LocalizationProvider>
    </Wrapper>
  );
};

export default CustomDatePicker;
