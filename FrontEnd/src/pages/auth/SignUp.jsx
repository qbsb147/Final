import React, { useState } from 'react';
import styled from 'styled-components';
import loginBg from '../../assets/loginBgImg.jpg';
import logo from '../../assets/LoginLogo.png';
import logoText from '../../assets/LoginText.png';
import memberService from '../../api/members';
import { validateForm } from '../../hooks/useAuth';
import { useDefaultForm, useEmployeeForm, useMasterForm, useMasterProfileForm } from '../../schemas/schema';
import DefaultStep from '../../components/auth/Default';
import EmployeeStep from '../../components/auth/Employee';
import MasterStep from '../../components/auth/Master';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { businessApi } from '../../api/businessApi';
import { handleBusinessValidationResult } from '../../hooks/useValidation';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import MasterProfileStep from '../../components/auth/MaterProfile';

const SignUp = () => {
  const [formStep, setFormStep] = useState(1);
  const [formData1, setFormData1] = useState({
    gender: 'M',
    role: 'EMPLOYEE',
  });
  const [formData2, setFormData2] = useState({});
  const [formData3, setFormData3] = useState({});
  const [selectedRole, setSelectedRole] = useState('EMPLOYEE');
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();
  const { control } = useForm();
  const handleNext = async () => {
    let valid = true;
    if (formStep === 1) {
      valid = await validateForm(useDefaultForm, formData1);
    } else if (formStep === 2 && formData1.role === 'MASTER') {
      valid = await validateForm(useMasterForm, formData2);
    }
    if (!valid) return;
    setFormStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setFormStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. 비밀번호 일치 체크 (1단계에서만)
    if (formStep === 1 && formData1.user_pwd !== formData1.user_pwd_check) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 2. 단계별 유효성 검사
    if (formStep === 1) {
      const valid = await validateForm(useDefaultForm, formData1);
      if (!valid) return;
    } else if (formStep === 2 && selectedRole === 'EMPLOYEE') {
      // EMPLOYEE 2단계: 직원 정보 유효성 검사
      const isValid = await validateForm(useEmployeeForm, formData2);
      if (!isValid) return;

      // 2-1. 마스터일 때만 국세청 API 호출
      if (selectedRole === 'MASTER') {
        try {
          const data = await businessApi({
            business_id: formData2.business_id,
            licensee: formData2.licensee,
            open_date: formData2.open_date,
          });
          if (!handleBusinessValidationResult(data)) return;
        } catch (err) {
          const msg = err.response?.data?.message || err.message || err;
          toast.error('사업자 진위 확인에 실패했습니다. : ' + msg);
          return;
        }
      }
    } else if (formStep === 2 && formData1.role === 'MASTER') {
      // MASTER 2단계: 회사 정보 유효성 검사
      const isValid = await validateForm(useMasterForm, formData2);
      if (!isValid) return;
      // 2단계에서는 회원가입하지 않고 3단계로 이동
      setFormStep(3);
      return;
    } else if (formStep === 3 && formData1.role === 'MASTER') {
      // MASTER 3단계: 직원 정보 입력 단계 (formData3)
      const isValid = await validateForm(useMasterProfileForm, formData3);
      if (!isValid) return;
    }

    // 3. 회원가입 API 호출
    try {
      await memberService.register(formData1, formData2, formData3);
      toast.success('회원가입에 성공했습니다!');
      navigate('/login');
    } catch (error) {
      toast.error(`회원가입 실패 : ${error}`);
    }
  };

  return (
    <SignUpWrap>
      <ContentWrap>
        <SignUpCard>
          {/* 로고 영역 */}
          <LogoWrap>
            <LogoImg src={logo} alt="logo" />
            <img src={logoText} />
          </LogoWrap>

          {/* STEP 1 - 기본 정보 입력 */}
          {formStep === 1 && (
            <DefaultStep
              setSelectedRole={setSelectedRole}
              formData1={formData1}
              setFormData1={setFormData1}
              setFormData2={setFormData2}
              setFormData3={setFormData3}
              control={control}
              emailVerified={emailVerified}
              setEmailVerified={setEmailVerified}
            />
          )}

          {/* STEP 2 - 직원 */}
          {formStep === 2 && formData1.role === 'EMPLOYEE' && (
            <EmployeeStep setFormData1={setFormData1} setFormData2={setFormData2} formData2={formData2} />
          )}

          {/* STEP 2 - 회사 */}
          {formStep === 2 && formData1.role === 'MASTER' && (
            <MasterStep
              setFormData1={setFormData1}
              setFormData2={setFormData2}
              setFormData3={setFormData3}
              formData2={formData2}
            />
          )}

          {/* STEP 3 - 마스터 프로필(직원) 입력 */}
          {formStep === 3 && formData1.role === 'MASTER' && (
            <MasterProfileStep
              setFormData1={setFormData1}
              setFormData2={setFormData2}
              setFormData3={setFormData3}
              formData3={formData3}
              formData2={formData2}
            />
          )}

          {/* 버튼 영역 */}
          <BtnFlex>
            {formStep === 1 && (
              <>
                <Btn onClick={() => window.history.back()}>취소</Btn>
                <Btn
                  onClick={async (e) => {
                    if (!emailVerified) {
                      toast.error('이메일 인증을 완료해주세요.');
                      return;
                    }
                    if (selectedRole === 'WORCATION') handleSubmit(e);
                    else handleNext(e);
                  }}
                >
                  {selectedRole === 'WORCATION' ? '완료' : '다음'}
                </Btn>
              </>
            )}

            {formStep === 2 && formData1.role === 'EMPLOYEE' && (
              <>
                <Btn onClick={handlePrev}>이전</Btn>
                <Btn onClick={handleSubmit}>완료</Btn>
              </>
            )}

            {formStep === 2 && formData1.role === 'MASTER' && (
              <>
                <Btn onClick={handlePrev}>이전</Btn>
                <Btn onClick={handleNext}>다음</Btn>
              </>
            )}

            {formStep === 3 && formData1.role === 'MASTER' && (
              <>
                <Btn onClick={handlePrev}>이전</Btn>
                <Btn onClick={handleSubmit}>완료</Btn>
              </>
            )}
          </BtnFlex>
        </SignUpCard>
      </ContentWrap>
    </SignUpWrap>
  );
};

const SignUpWrap = styled.div`
  width: 100%;
  height: 100vh;
  background-image: url(${loginBg});
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.black};
`;

const ContentWrap = styled.div`
  width: 1280px;
  height: 80vh;
  display: flex;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.67);
  box-shadow: 4px 4px 8px 8px rgba(0, 0, 0, 0.08);
  padding: ${({ theme }) => theme.spacing.s8} ${({ theme }) => theme.spacing.s3};
`;

const SignUpCard = styled.div`
  width: 80%;
  font-family: ${({ theme }) => theme.fontFamily.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.base};
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;
const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.s4};
`;

const LogoImg = styled.img`
  width: 70px;
  height: 70px;
`;

const BtnFlex = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.s3};
`;
const Btn = styled.button`
  width: 100px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.black};
  border: none;
`;

export default SignUp;
