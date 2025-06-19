import Header from './common/Header';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Footer from './common/Footer';

const Layout2 = () => {
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

export default Layout2;

const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  flex: 1;
  padding: 180px 16px 20px 16px;
`;
