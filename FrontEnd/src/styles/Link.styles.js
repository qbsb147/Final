// src/styles/Link.styles.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const WhiteButtonLink = styled(Link)`
  box-sizing: border-box;
  background: #ffffff;
  font-family: 'Godo B', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  color: #000000 !important;
  cursor: pointer;
  text-decoration: none !important;
  padding: 8px 24px;
  border: none;
  border-radius: 8px;
  display: inline-block;
  text-align: center;
  /* 필요하다면 추가 스타일 */
`;
