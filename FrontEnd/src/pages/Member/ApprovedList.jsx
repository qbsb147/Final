import React from 'react';
import styled from 'styled-components';
import LeftContent from '../../components/Member/LeftContent';
import MemberSearchBar from '../../components/Member/MemberSearchBar';
import EmployeeApproveTable from '../../components/Member/table/EmployeeApproveTable';

const MemberApplies = () => {
  return (
    <MemberListWrap>
      <LeftNav>
        <LeftContent />
      </LeftNav>
      <MainContent>
        <Title>직원 승인 목록</Title>
        <Container>
          <MemberSearchBar />
          <EmployeeApproveTable />
        </Container>
      </MainContent>
    </MemberListWrap>
  );
};

export default MemberApplies;

const MemberListWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start; /* 컨텐츠를 위에서부터 정렬 */
  gap: ${({ theme }) => theme.spacing.s10}; /* 왼쪽과 오른쪽 컬럼 사이의 간격 */
  width: 100%;
  max-width: 1280px;
`;
const Title = styled.h1`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: ${({ theme }) => theme.spacing.s4};
`;
const LeftNav = styled.nav`
  width: 200px; /* 왼쪽 내비게이션 너비 고정 */
  flex-shrink: 0; /* 창이 줄어들어도 너비 유지 */
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.s3};
  height: 100%;
`;

const MainContent = styled.div`
  flex-grow: 1; /* 남은 공간을 모두 차지 */
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.s6};
  min-height: 600px; /* 컨텐츠가 없어도 최소 높이 유지 */
  height: 100vh;
`;
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s6};
`;
