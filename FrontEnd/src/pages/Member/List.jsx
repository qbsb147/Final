import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LeftContent from '../../components/Member/LeftContent';
import MemberSearchBar from '../../components/Member/MemberSearchBar';
import MemberTable from '../../components/Member/table/MemberTable ';
import useAuthStore from '../../store/authStore';

const MemberList = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 페이지 상태 추가
  const { loginUser } = useAuthStore();
  // const navigate = useNavigate();
  // const alertedRef = useRef(false);

  // useEffect(() => {
  //   if (alertedRef.current) return; // 이미 실행했으면 아무것도 하지 않음

  //   // 로그인 안 했거나, 권한이 manager/master가 아닐 때
  //   if (!loginUser || !['manager', 'master'].includes(loginUser.role)) {
  //     alertedRef.current = true; // 중복 실행 방지
  //     alert('접근 권한이 없습니다.');
  //     navigate('/');
  //   }
  // }, [loginUser, navigate]);

  // if (!loginUser || !['manager', 'master'].includes(loginUser.role)) {
  //   return null; // 혹은 로딩 스피너 등을 표시
  // }

  return (
    <MemberListWrap>
      <LeftNav>
        <LeftContent />
      </LeftNav>
      <MainContent>
        <Title>직원 정보</Title>
        <Container>
          <MemberSearchBar onSearch={setSearchKeyword} />
          <MemberTable searchKeyword={searchKeyword} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </Container>
      </MainContent>
    </MemberListWrap>
  );
};

export default MemberList;

const Title = styled.h1`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: ${({ theme }) => theme.spacing.s4};
`;

const MemberListWrap = styled.div`
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
