import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Table from '../../../components/Member/table/PartnerApprovedListTable';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';

const ApprovedList = () => {
  const { loginUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loginUser?.user_id) return;

    if (loginUser.role !== 'MASTER' || loginUser !== 'MANAGER') {
      navigate('/error');
      return;
    }
  });
  return (
    <ListWrap>
      <MainContent>
        <Title>제휴 승인 목록</Title>
        <Container>
          <Table userNo={loginUser.user_no} />
        </Container>
      </MainContent>
    </ListWrap>
  );
};

export default ApprovedList;

const Title = styled.h1`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: ${({ theme }) => theme.spacing.s8};
  font-weight: bold;
`;

const ListWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start; /* 컨텐츠를 위에서부터 정렬 */
  gap: ${({ theme }) => theme.spacing.s10}; /* 왼쪽과 오른쪽 컬럼 사이의 간격 */
  width: 100%;
  max-width: 1280px;
`;

const MainContent = styled.div`
  flex-grow: 1; /* 남은 공간을 모두 차지 */
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.s8};
  min-height: 600px; /* 컨텐츠가 없어도 최소 높이 유지 */
  height: 100%;
  background: ${({ theme }) => theme.colors.gray[100]};
`;
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s6};
  background: ${({ theme }) => theme.colors.white};
`;
