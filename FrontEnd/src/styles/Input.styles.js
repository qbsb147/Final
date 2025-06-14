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

export const LightGray = styled.input`
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.black};
`;
