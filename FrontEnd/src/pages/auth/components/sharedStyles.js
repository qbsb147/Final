import styled from 'styled-components';
import Input from '../../../styles/Input';

export const InputBox = styled.input`
  ${({ variant }) => {
    switch (variant) {
      case 'yellow':
        return Input.InputYellow;
      case 'gray':
        return Input.InputGray;
      case 'orange':
        return Input.InputOrange;
      default:
        return '';
    }
  }};
  width: 400px;
  padding: ${({ theme }) => theme.spacing.s3};
  box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.25);
  margin: ${({ theme }) => theme.spacing.s0};
`;

export const Btn = styled.button`
  width: 100px;
  height: 52.41px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.black};
  border: none;
`;

export const RadioGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.s10};
  margin: ${({ theme }) => theme.spacing.s9} ${({ theme }) => theme.spacing.s0};
`;

export const Label = styled.label`
  display: block;
  text-align: left;
  margin-bottom: ${({ theme }) => theme.spacing.s2};
  margin-left: ${({ theme }) => theme.spacing.s1};
`;

export const StyledDatePickerWrapper = styled.div`
  .react-datepicker__input-container input {
    box-sizing: border-box;
    max-width: 100%;
    width: 400px;
    height: 52.41px;
    background: #ffffff;
    border: 3px solid #ffeb8c;
    border-radius: 10px;
    color: black;
    padding: 0 12px;
    font-size: ${({ theme }) => theme.fontSizes.base};
    outline: none;
    margin: 0;
    box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.25);
  }
  .react-datepicker__input-container input::placeholder {
    color: #adadad;
    opacity: 1;
  }
  .react-datepicker__input-container input:focus {
    border-color: #ffeb8c;
    background: #fff;
  }
`;

export const CompanyDropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #fffbe6;
  border: 1px solid #ffeb8c;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 10;
  max-height: 220px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
`;
export const DropdownItem = styled.li`
  padding: 10px 16px;
  height: 44px;
  cursor: pointer;
  &:hover {
    background: #fff3b0;
  }
`;

export const AddressSearchButton = styled.button`
  height: 52.41px;
  min-width: 80px;
  padding: 0 12px;
  background: #feffe0;
  border: 3px solid #dda900;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-family: ${({ theme }) => theme.fontFamily.primary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.black};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
