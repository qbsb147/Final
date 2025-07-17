import React, { useState } from 'react';

import styled from 'styled-components';
import LeftContent from '../../components/Member/LeftContent';
import WorcationTable from '../../components/Member/table/WorcationTable';
import CalenderContainoer from '../../components/Member/CalenderContainoer';
import MemberSearchBar from '../../components/Member/MemberSearchBar';

const WorcationAppliesList = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <MemberListWrap>
      <LeftNav>
        <LeftContent />
      </LeftNav>
      <MainContent>
        <CalenderContainoer />
        <Title>워케이션 신청자</Title>
        <Container>
          <MemberSearchBar onSearch={setSearchKeyword} />
          <WorcationTable searchKeyword={searchKeyword} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </Container>
      </MainContent>
    </MemberListWrap>
  );
};

export default WorcationAppliesList;

const MemberListWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.s10};
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
  width: 200px;
  height: 100%;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.s3};
`;

const MainContent = styled.div`
  flex-grow: 1;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.s6};
  min-height: 600px;
`;
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s6};
`;
