import React from 'react';
import Header from './common/Header';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Footer from './common/Footer';


const LayoutMember = () => {
  return (
    <>
      <Header />
      <Content>
        <Outlet />
      </Content>
    </>
  );
};

const Content = styled.main`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  margin-top: 200px;
`;

export default LayoutMember;
