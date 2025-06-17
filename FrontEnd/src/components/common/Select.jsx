import React from 'react';
import styled from 'styled-components';

const CustomSelect = ({ options, value, onChange }) => {
  return (
    <StyledSelect value={value} onChange={onChange}>
      <option value="">선택해주세요</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
};

export default CustomSelect;

const StyledSelect = styled.select`
  width: ${({ theme }) => theme.widthes.input};
  height: ${({ theme }) => theme.heightes.input};
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-family: ${({ theme }) => theme.fontFamily.secondary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.gray[100]};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.white};
  }
`;
