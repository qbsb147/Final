import React from 'react';
import Header from './common/Header';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Footer from './common/Footer';

const Layout = () => {
  return (
    <PageWrapper>
      <Header />
      <Content>
        <Outlet />
      </Content>
      <Footer />
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  /* 페이지 전체를 덮는 배경색 설정 */
  background-color: ${({ theme }) => theme.colors.white};
  min-height: 100vh;
  position: relative;
`;

const Content = styled.main`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  /* Header가 position: absolute 속성으로 200px 높이를 가지므로,
    컨텐츠가 헤더에 가려지지 않도록 상단에 패딩 부여
    (헤더 높이 200px + 여백 20px)
  */
  padding: 120px 16px 20px 16px;
`;

export default Layout;
