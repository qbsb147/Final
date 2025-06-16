import React from 'react';
import Header from './common/Header';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Footer from './common/Footer';

import Input from '../styles/Input';
import WorcationList from '../pages/WorcationList';
import Main from '../pages/MainPage';
import Detail from '../pages/WorcationDetail';
import PartnershipForm from '../pages/Partner/PartnershipApplication';
import WorcationApply from '../pages/WorcationApply';
import AffiliationRequests from '../pages/Partner/AffiliationRequests';
import NeedsConsult from '../pages/Member/NeedsConsult';
import MemberApplies from '../pages/Member/MemberApplies';
import MemberWorcationList from '../pages/Member/WorkcationList';
import PartnerApprovedList from '../pages/Partner/PartnerApprovedList';

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
  margin-top: 200px;
`;

export default Layout;
