import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ReservationSearchBar from '../../components/worcation/ReservationSearchBar';
import ReservationTable from '../../components/worcation/ReservationTable ';
import useAuthStore from '../../store/authStore';

const Reservation = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 페이지 상태 추가

  return (
    <ReservationListWrap>
      <MainContent>
        <Title>예약자 정보</Title>
        <Container>
          <ReservationSearchBar onSearch={setSearchKeyword} />
          <ReservationTable searchKeyword={searchKeyword} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </Container>
      </MainContent>
    </ReservationListWrap>
  );
};

export default Reservation;

const Title = styled.h1`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: ${({ theme }) => theme.spacing.s4};
`;

const ReservationListWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.s10};
  width: 100%;
  max-width: 1280px;
`;

const LeftNav = styled.nav`
  width: 200px;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.s3};
  height: 100%;
`;

const MainContent = styled.div`
  flex-grow: 1;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.s6};
  min-height: 600px;
  height: 100vh;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s6};
`;
