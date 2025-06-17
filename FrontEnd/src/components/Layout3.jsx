import Header from './common/Header';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const Layout3 = () => {
  return (
    <PageWrapper>
      <Header />
      <Content>
        <Outlet />
      </Content>
    </PageWrapper>
  );
};

export default Layout3;

const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  flex: 1;
  padding: 220px 16px 20px 16px;
`;
