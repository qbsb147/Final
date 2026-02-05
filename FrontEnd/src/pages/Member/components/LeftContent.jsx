import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MdOutlinePersonAddAlt1 } from 'react-icons/md';
import { MdKeyboardArrowRight } from 'react-icons/md';

const LeftContent = () => {
  const items = [
    { label: '직원 목록', path: '/employee/list' },
    { label: '워케이션 신청자', path: '/employee/worcation-applies' },
    { label: '상담 필요자', path: '/employee/needs-consult' },
    { label: '직원 승인 목록', path: '/employee/applies' },
  ];

  return (
    <ListWrap>
      {items.map((item, idx) => (
        <ListItem key={idx}>
          <StyledLink to={item.path}>
            <LeftGroup>
              <Circle />
              <ListIcon />
              <Label>{item.label}</Label>
            </LeftGroup>
            <ListIconRight />
          </StyledLink>
        </ListItem>
      ))}
    </ListWrap>
  );
};

// 전체 리스트 영역
const ListWrap = styled.ul`
  width: 100%;
  padding: 0;
  margin: ${({ theme }) => theme.spacing.s1} 0 ${({ theme }) => theme.spacing.s2} 0;
`;

// 각 항목 li
const ListItem = styled.li`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.black};
`;

// 내부 링크 스타일
const StyledLink = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.black};
  padding: ${({ theme }) => theme.spacing.s4} ${({ theme }) => theme.spacing.s1};
`;

// 왼쪽 그룹 (원 + 아이콘 + 텍스트)
const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s1};
`;

// 원형 이미지 대체
const Circle = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #e6d3fc; // 연보라색
`;

// 사람 아이콘
const ListIcon = styled(MdOutlinePersonAddAlt1)`
  width: 18px;
  height: 18px;
`;

// 오른쪽 화살표 아이콘
const ListIconRight = styled(MdKeyboardArrowRight)`
  width: 18px;
  height: 18px;
`;

// 텍스트
const Label = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export default LeftContent;
