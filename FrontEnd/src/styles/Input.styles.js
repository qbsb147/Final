import styled from 'styled-components';

export const InputYellow = styled.input`
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.white};
  border: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.black};
`;

export const InputGray = styled.input`
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[500]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.black};
`;

export const InputOrange = styled.input`
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.white};
  border: 3px solid #f8c470;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.black};
`;

export const InputLightGray = styled.input`
  padding: 0 12px;
  height: ${({ theme }) => theme.heightes.input};
  width: ${({ theme }) => theme.widthes.input};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-family: ${({ theme }) => theme.fontFamily.secondary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.gray[100]};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.white};
  }

  &::placeholder {
    font-family: ${({ theme }) => theme.fontFamily.secondary};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
`;

export const InputRadio = styled.input`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: #adadad;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  margin-left: 10px;
  cursor: pointer;
  position: relative;

  &:checked::after {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    width: 10px;
    height: 10px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
  }
`;
