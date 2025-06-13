import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const AuthContainer = styled.div`
  max-width: 400px;
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.gray[800]};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  text-align: left;
`;

export const Input = styled.input`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.gray[300])};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  transition: all 0.2s ease;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

export const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const Button = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  transition: all 0.2s ease;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const AuthLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  &:hover {
    text-decoration: underline;
  }
`;
