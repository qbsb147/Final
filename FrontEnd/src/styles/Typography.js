import styled from 'styled-components';
import { media } from './MediaQueries';

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  `}

  ${media.lg`
    font-size: ${({ theme }) => theme.fontSizes['4xl']};
  `}
`;

export const Subtitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    margin-bottom: ${({ theme }) => theme.spacing[6]};
  `}
`;

export const Text = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  line-height: 1.5;

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.base};
  `}
`;

export const SmallText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[600]};

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `}
`;

export const Price = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};

  ${media.md`
    font-size: ${({ theme }) => theme.fontSizes.base};
  `}
`;
