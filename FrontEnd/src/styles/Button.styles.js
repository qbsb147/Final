import styled from 'styled-components';

export const ButtonLogin = styled.button`
  box-sizing: border-box;
  position: absolute;
  left: calc(50% - 100px);
  top: calc(50% - 30px);
  border: 4px solid ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-family: ${({ theme }) => theme.fontFamily.secondary};
  font-style: normal;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.black};
`;

export const ButtonYb = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-family: ${({ theme }) => theme.fontFamily.primary};
  font-style: normal;
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const ButtonBorder = styled.button`
  box-sizing: border-box;
  background: #feffe0;
  border: 3px solid #dda900;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-family: ${({ theme }) => theme.fontFamily.primary};
  font-style: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.black};
  padding: ${({ theme }) => theme.spacing.buttonPadding};
  height: 30px;
`;

export const ButtonWhite = styled.button`
  box-sizing: border-box;
  position: absolute;
  left: calc(50% - 200px / 2 + 122px);
  top: 702px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-family: ${({ theme }) => theme.fontFamily.primary};
  font-style: normal;
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.black};
  justify-content: center;
  cursor: pointer;
  filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.25));
`;

export const ButtonDetail = styled.button`
  background: rgba(250, 215, 0, 0.7);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  font-family: ${({ theme }) => theme.fontFamily.primary};
  font-style: normal;
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ButtonYbShadow = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-family: ${({ theme }) => theme.fontFamily.primary};
  font-style: normal;
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-size: ${({ theme }) => theme.fontSizes.base};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.25));
`;

export const BtnWhiteYellowBorder = styled.button`
  background: ${({ theme }) => theme.colors.white};
  box-sizing: border-box;
  border: 3px solid #dda900;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-family: ${({ theme }) => theme.fontFamily.primary};
  font-style: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.black};
  padding: ${({ theme }) => theme.spacing.buttonPadding};
`;
