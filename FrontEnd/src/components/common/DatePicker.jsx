import React from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ko } from 'date-fns/locale';

const CustomDatePicker = ({ selected, onChange }) => {
  return (
    <StyledDatePicker
      selected={selected}
      onChange={onChange}
      dateFormat="yyyy년 MM월 dd일"
      locale={ko}
      placeholderText="날짜를 선택해주세요"
    />
  );
};

export default CustomDatePicker;

const StyledDatePicker = styled(DatePicker)`
  width: 200px;
  height: ${({ theme }) => theme.heightes.button};
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.gray[100]};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`; 