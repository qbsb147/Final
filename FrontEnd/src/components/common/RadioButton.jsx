import React from 'react';
import styled from 'styled-components';

const RadioButton = ({ options, selected, onChange }) => {
  return (
    <RadioGroup>
      {options.map((option) => (
        <StyledLabel key={option.value}>
          <HiddenRadio
            name="custom-radio"
            value={option.value}
            checked={selected === option.value}
            onChange={(e) => onChange(e.target.value)}
          />
          <CustomRadio />
          {option.label}
        </StyledLabel>
      ))}
    </RadioGroup>
  );
};

export default RadioButton;

const RadioGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.s4};
`;

const HiddenRadio = styled.input.attrs({ type: 'radio' })`
  display: none;
`;

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fontFamily.primary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.black};
  user-select: none;
`;

const CustomRadio = styled.span`
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.colors.gray[400]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  margin-right: ${({ theme }) => theme.spacing.s2};
  position: relative;
  transition: border-color 0.2s;

  ${HiddenRadio}:checked + & {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary};
  }

  ${HiddenRadio}:checked + &::after {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    width: 8px;
    height: 8px;
    background: ${({ theme }) => theme.colors.black};
    border-radius: 50%;
  }
`;
