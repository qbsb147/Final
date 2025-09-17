import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import Cookies from 'js-cookie';
import useAuthStore from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 레이아웃
import Layout from './components/Layout/Layout'; // Header + SearchBar + Footer
import Layout2 from './components/Layout/Layout2'; // Header + Footer (SearchBar 없음)
import Layout3 from './components/Layout/Layout3'; // Header만 (Footer 없음)

// 공통 페이지
import Login from './pages/auth/Login'; // 로그인
import SignUp from './pages/auth/SignUp'; // 회원가입
import NotFound from './pages/error/NotFound'; // 404

// 메인
import MainPage from './pages/MainPage'; // 메인 페이지

// 심리 테스트
import Trial from './pages/test/Trial'; // 테스트 홈
import StressTest from './pages/test/StressTest'; // 스트레스 테스트
import BurnoutTest from './pages/test/BurnoutTest'; // 번아웃 테스트
import TendencyTest from './pages/test/TendencyTest'; // 성향 테스트

// 워케이션
import WorcationMainList from './pages/Worcation/List'; // 전체 워케이션 리스트
import WorcationRegister from './pages/Worcation/Registraion/List'; // 업체 등록 리스트
import Register from './pages/Worcation/Registraion/Register'; // 업체 등록 폼
import WorcationDetail from './pages/Worcation/Detail'; // 워케이션 상세 페이지
import WorcationApply from './pages/Worcation/Apply'; // 워케이션 신청
import WorcationHistory from './pages/Worcation/History'; // 내 워케이션 히스토리
import WorcationPartnersPage from './pages/Worcation/Partners'; //워케이션 제휴 리스트
import WorcationAIPage from './pages/Worcation/ai'; //워케이션 AI 리스트

// 직원 / 멤버 관리
import MemberList from './pages/Member/List'; // 직원 리스트
import NeedsConsult from './pages/Member/NeedsConsult'; // 상담 필요 직원 리스트
import MemberApplies from './pages/Member/ApprovedList'; // 승인 대기 리스트
import WorcationAppliesList from './pages/Member/WorcationAppliesList'; // 직원 워케이션 신청 리스트

// 마이페이지
import Mypage from './pages/auth/Mypage'; // 내 정보
import BodyInfo from './pages/auth/BodyInfo'; // 신체 정보
import Reservation from './pages/Worcation/Reservation'; //예약자확인

// 식단
import Eat from './pages/eat/Eat'; // 식단 확인

// 제휴 관련
import PartnershipApplication from './pages/Worcation/Partnership/Application'; // 제휴 신청
import ApprovedList from './pages/Worcation/Partnership/ApprovedList'; // 제휴 승인 목록
import Requests from './pages/Worcation/Partnership/Requests'; // 제휴 요청 목록

function App() {
  useEffect(() => {
    useAuthStore
      .getState()
      .autoFetchUserInfo()
      .catch((error) => {
        console.log('사용자 정보 가져오기 실패 (토큰 없음 또는 만료):', error);
      });
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ToastContainer />
        <Routes>
          {/* 🟣 Layout1: 기본 레이아웃 (SearchBar 포함) */}
          <Route element={<Layout />}>
            <Route path="/" element={<MainPage />} /> {/* 메인 페이지 */}
            <Route path="/worcation" element={<WorcationMainList />} /> {/* 워케이션 전체 리스트 */}
            <Route path="/worcation/list" element={<WorcationMainList />} /> {/* 워케이션 전체 리스트 (검색용) */}
            <Route path="/worcation/partners" element={<WorcationPartnersPage />} />
            {/* 워케이션 제휴 리스트 */}
            <Route path="/worcation/ai" element={<WorcationAIPage />} />
            {/* 워케이션 AI 리스트 */}
          </Route>

          {/* 🔵 Layout2: SearchBar 없음 */}
          <Route element={<Layout2 />}>
            {/* 마이페이지 */}
            <Route path="/my/info" element={<Mypage />} /> {/* 내 정보 */}
            {/* <Route path="/my/worcation-history" element={<WorcationHistory />} /> */}
            {/* 워케이션 히스토리 */}
            <Route
              path="/my/worcation-history"
              element={
                <ProtectedRoute allowedRoles={['MASTER', 'MANAGER', 'EMPLOYEE']}>
                  <WorcationHistory />
                </ProtectedRoute>
              }
            />
            <Route path="/my/body" element={<BodyInfo />} /> {/* 신체 정보 */}
            {/* 예약자 확인*/}
            <Route
              path="my/reservation"
              element={
                <ProtectedRoute allowedRoles={['WORCATION']}>
                  <Reservation />
                </ProtectedRoute>
              }
            />
            {/* 워케이션 상세 및 등록 리스트 */}
            {/* <Route path="/worcation/register-list" element={<WorcationRegister />} /> 워케이션 등록 리시트 */}
            <Route
              path="/worcation/register-list"
              element={
                <ProtectedRoute allowedRoles={['WORCATION']}>
                  <WorcationRegister />
                </ProtectedRoute>
              }
            />
            <Route path="/worcation/:worcationNo" element={<WorcationDetail />} />
            <Route path="/worcation/temp/:worcationNo" element={<WorcationDetail />} />
            {/* 식단 */}
            <Route path="/eat" element={<Eat />} /> {/* 식단 정보 */}
            {/* 심리 테스트 */}
            <Route path="/trial" element={<Trial />} />
            <Route path="/trial/stress" element={<StressTest />} />
            <Route path="/trial/burnout" element={<BurnoutTest />} />
            <Route path="/trial/tendency" element={<TendencyTest />} />
            {/* 직원 관련 */}
            {/* <Route path="/employee/list" element={<MemberList />} />
            <Route path="/employee/worcation-applies" element={<WorcationAppliesList />} />
            <Route path="/employee/needs-consult" element={<NeedsConsult />} />
            <Route path="/employee/applies" element={<MemberApplies />} /> */}
            <Route
              path="/employee/list"
              element={
                <ProtectedRoute allowedRoles={['MASTER', 'MANAGER']}>
                  <MemberList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/worcation-applies"
              element={
                <ProtectedRoute allowedRoles={['MASTER', 'MANAGER']}>
                  <WorcationAppliesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/needs-consult"
              element={
                <ProtectedRoute allowedRoles={['MASTER', 'MANAGER']}>
                  <NeedsConsult />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/applies"
              element={
                <ProtectedRoute allowedRoles={['MASTER', 'MANAGER']}>
                  <MemberApplies />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 🟡 Layout3: Footer 없음 */}
          <Route element={<Layout3 />}>
            {/* <Route path="/worcation/register" element={<Register />} /> 업체 등록 */}
            {/* <Route path="/worcation/edit/:worcation_no" element={<Register />} />  */}
            {/* <Route path="/worcation/register/:worcation_no" element={<Register />} /> */}
            {/* <Route path="/worcation/apply" element={<WorcationApply />} /> 워케이션 신청  */}
            <Route
              path="/worcation/apply"
              element={
                <ProtectedRoute allowedRoles={['MASTER', 'MANAGER', 'EMPLOYEE']}>
                  <WorcationApply />
                </ProtectedRoute>
              }
            />
            {/* 워케이션 신청 */}
            {/* 권한 설정한 페이지 */}
            {/* 업체 등록 */}
            <Route
              path="/worcation/register"
              element={
                <ProtectedRoute allowedRoles={['WORCATION']}>
                  <Register />
                </ProtectedRoute>
              }
            />
            {/* 업체 수정 */}
            <Route
              path="/worcation/edit/:worcation_no"
              element={
                <ProtectedRoute allowedRoles={['WORCATION']}>
                  <Register />
                </ProtectedRoute>
              }
            />
            {/* 업체 스장 */}
            <Route
              path="/worcation/register/:worcation_no"
              element={
                <ProtectedRoute allowedRoles={['WORCATION']}>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path="/partnership/apply"
              element={
                <ProtectedRoute allowedRoles={['MASTER', 'MANAGER']}>
                  <PartnershipApplication />
                </ProtectedRoute>
              }
            />{' '}
            {/* 제휴 신청 */}
            {/* 승인된 제휴 목록 */}
            <Route
              path="/partnership/approveList"
              element={
                <ProtectedRoute allowedRoles={['WORCATION']}>
                  <ApprovedList />
                </ProtectedRoute>
              }
            />
            {/* 제휴 요청 목록 */}
            <Route
              path="/partnership/requests"
              element={
                <ProtectedRoute allowedRoles={['WORCATION']}>
                  <Requests />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/partnership/approveList" element={<ApprovedList />} /> */}
            {/* 승인된 제휴 목록 */}
            {/* <Route path="/partnership/requests" element={<Requests />} /> */}
            {/* 제휴 요청 목록 */}
          </Route>

          {/* 로그인/회원가입 */}
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />

          {/* 404 */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
