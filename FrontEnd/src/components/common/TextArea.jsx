import React from 'react';
import styled from 'styled-components';

const CustomTextArea = ({ value, onChange, rows = 3 }) => {
  return (
    <StyledTextArea
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder="내용을 입력해주세요"
    />
  );
};

export default CustomTextArea;

const StyledTextArea = styled.textarea`
  width: 400px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-family: ${({ theme }) => theme.fontFamily.primary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.gray[100]};
  resize: none;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    font-family: ${({ theme }) => theme.fontFamily.primary};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
`; 