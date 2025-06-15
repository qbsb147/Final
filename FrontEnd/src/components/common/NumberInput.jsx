import React from 'react';
import styled from 'styled-components';

const NumberInput = ({ value, onChange, format }) => {
  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    onChange(value);
  };

  const displayValue = format ? 
    Number(value).toLocaleString('ko-KR') : 
    value;

  return (
    <StyledInput
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder="숫자를 입력해주세요"
    />
  );
};

export default NumberInput;

const StyledInput = styled.input`
  width: 200px;
  height: ${({ theme }) => theme.heightes.button};
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-family: ${({ theme }) => theme.fontFamily.primary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.gray[100]};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    font-family: ${({ theme }) => theme.fontFamily.primary};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
`; 