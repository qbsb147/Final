import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import Layout from './components/Layout';
import Layout2 from './components/Layout2';
import Login from './pages/Login/Login';
import SignUp from './pages/Login/SignUp';
import Mypage from './pages/Mypage';
import BodyInfo from './pages/BodyInfo';
import Trial from './pages/test/Trial';
import MemberList from './pages/Member/MemberList';
import Layout3 from './components/Layout3';
import Register from './pages/worcation/Register';
import WorcationList from './pages/WorcationList';
import NeedsConsult from './pages/Member/NeedsConsult';
import MemberApplies from './pages/Member/MemberApplies';
import WorcationApply from './pages/WorcationApply';
import MainPage from './pages/MainPage';
import WorcationAppliesList from './pages/Member/WorcationAppliesList';
import WorcationHistory from './pages/WorcationHistory';
import Eat from './pages/eat/Eat';
import StressTest from './pages/test/StressTest';
import BurnoutTest from './pages/test/BurnoutTest';
import TendencyTest from './pages/test/TendencyTest';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Routes>
          {/* serachbar포함 */}
          <Route element={<Layout />}>
            {/* 메인페이지 */}
            <Route path="/" element={<MainPage />} />

            {/* 심리검사 */}
            <Route path="/trial" element={<Trial />} />
            <Route path="/trial/stress" element={<StressTest />} />
            <Route path="/trial/burnout" element={<BurnoutTest />} />
            <Route path="/trial/tendency" element={<TendencyTest />} />

            {/* 워케이션 */}
            <Route path="/worcation" element={<WorcationList />} />

            {/* 워케이션 신청(회원용) */}
            <Route path="/worcation/apply" element={<WorcationApply />} />

            {/* 직원 목록 리스트 */}
            <Route path="/member/list" element={<MemberList />} />

            {/* 워케이션 신청 리스트 */}
            <Route path="/member/worcation-applies" element={<WorcationAppliesList />} />

            {/* 상담 필요자 리스트 */}
            <Route path="/member/needs-consult" element={<NeedsConsult />} />

            {/* 직원 승인 목록 리스트 */}
            <Route path="/member/applies" element={<MemberApplies />} />
          </Route>

          {/* serachbar미포함 */}
          <Route element={<Layout2 />}>
            {/* 마이페이지 */}
            <Route path="/my/info" element={<Mypage />} />
            <Route path="/my/worcation-history" element={<WorcationHistory />} />

            {/* 신체 정보 */}
            <Route path="/my/body" element={<BodyInfo />} />
            <Route path="/eat" element={<Eat />} />
          </Route>

          {/* Footer미포함 */}
          <Route element={<Layout3 />}>
            {/* 워케이션 등록(워케이션 업체용) */}
            <Route path="/worcation/register" element={<Register />} />
          </Route>

          {/* 로그인, 회원가입 */}
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
