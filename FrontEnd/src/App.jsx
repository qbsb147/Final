import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import Layout from './components/Layout';
import Layout2 from './components/Layout2';
import Home from './pages/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/Login/SignUp';

import Worcation from './pages/Worcation';

import Mypage from './pages/Mypage';
import BodyInfo from './pages/BodyInfo';
import Trial from './pages/Trial';
import StressTest from './pages/StressTest';

import MemberList from './pages/Member/MemberList';
// import LayoutMember from './components/LayoutMember';
import Layout3 from './components/Layout3';
import Register from './pages/worcation/Register';
// import WorkcationList from './pages/Member/WorkcationList';
import NeedsConsult from './pages/Member/NeedsConsult';
import MemberApplies from './pages/Member/MemberApplies';
import BurnoutTest from './pages/BurnoutTest';
import TendencyTest from './pages/TendencyTest';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Routes>
          {/* 레이아웃 적용*/}
          <Route element={<Layout />}>
            {/* <Route path="/" element={<MainPage />} /> */}

            <Route path="/wrocation" element={<Worcation />} />
            <Route path="/trial" element={<Trial />} />
          </Route>
          <Route element={<Layout2 />}>
            <Route path="/my/info" element={<Mypage />} />
            <Route path="/my/body" element={<BodyInfo />} />
            <Route path="/trial/stress" element={<StressTest />} />
            <Route path="/trial/burnout" element={<BurnoutTest />} />
            <Route path="/trial/tendency" element={<TendencyTest />} />
          </Route>

          {/* 레이아웃 미적용 (직원 관리)*/}
          {/* <Route element={<LayoutMember />}>
            <Route path="/member/list" element={<MemberList />} />

            <Route path="/member/workation-applies" element={<WorkcationList />} />
            <Route path="/member/needs-consult" element={<NeedsConsult />} />
            <Route path="/member/applies" element={<MemberApplies />} />
          </Route> */}

          <Route element={<Layout3 />}>
            <Route path="/worcation/register" element={<Register />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
