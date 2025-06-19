// components/CustomRadioButton.jsx
import styled from 'styled-components';

const CustomRadioButton = ({ label, name, value, checked, onChange }) => {
  return (
    <RadioLabel>
      <HiddenRadio
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <StyledRadio checked={checked} />
      {label}
    </RadioLabel>
  );
};

export default CustomRadioButton;

// Styled Components
const HiddenRadio = styled.input`
  display: none;
`;

const StyledRadio = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid
    ${({ theme, checked }) =>
      checked ? theme.colors.gray[400] : theme.colors.gray[300]};
  background-color: ${({ theme, checked }) =>
    checked ? theme.colors.secondary : 'white'};
  display: inline-block;
  transition: all 0.2s ease;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s2};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;
