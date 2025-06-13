import React from 'react';
import Header from './common/Header';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Search from './common/Search/Search';
import Footer from './common/Footer';
import Input from '../styles/Input';
import WorcationList from '../pages/WorcationList';
import Main from '../pages/MainPage';
import Detail from '../pages/WorcationDetail';

const Layout = () => {
  return (
    <>
      <Header />
      <Content>
        <Outlet />
      </Content>
      <Footer />
    </>
  );
};

const Content = styled.main`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 16px;
`;

export default Layout;
