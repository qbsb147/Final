import Header from './common/Header';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Footer from './common/Footer';

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

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;
const Content = styled.main`
  flex: 1;
  width: 100%;
  max-width: ${({ theme }) => theme.widthes.maxWidth};
  margin: 0 auto;
  padding: 24px 0px 0px 0px;
  display: flex;
  flex-direction: column;
`;

export default Layout3;
