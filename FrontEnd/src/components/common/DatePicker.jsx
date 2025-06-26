import React from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';

const CustomDatePicker = ({ selected, onChange }) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat="yyyy년 MM월 dd일"
      locale={ko}
      placeholderText="날짜를 선택해주세요"
    />
  );
};

export default CustomDatePicker;
