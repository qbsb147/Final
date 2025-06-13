import React, { useState } from 'react';
import styled from 'styled-components';
import loginBg from '../../assets/loginBgImg.jpg';
import logo from '../../assets/LoginLogo.png';
import logoText from '../../assets/LoginText.png';
import Input from '../../styles/Input';

const step1Inputs = [
  { name: 'userId', type: 'text', placeholder: '아이디', side: 'left' },
  { name: 'password', type: 'password', placeholder: '비밀번호', side: 'left' },
  { name: 'passwordCheck', type: 'password', placeholder: '비밀번호 확인', side: 'left' },
  { name: 'username', type: 'text', placeholder: '이름', side: 'left' },
  { name: 'address', type: 'text', placeholder: '주소', side: 'right' },
  { name: 'birth', type: 'text', placeholder: '생년월일', side: 'right' },
  { name: 'email', type: 'text', placeholder: '이메일', side: 'right' },
  { name: 'phone', type: 'text', placeholder: '연락처', side: 'right' },
];

const step2InputsForTypeA = [
  { name: 'company', type: 'text', placeholder: '회사명', side: 'left' },
  { name: 'department', type: 'text', placeholder: '부서명', side: 'left' },
  { name: 'position', type: 'text', placeholder: '직급', side: 'left' },
  { name: 'address', type: 'text', placeholder: '회사주소', side: 'right' },
  { name: 'email', type: 'text', placeholder: '회사 이메일', side: 'right' },
  { name: 'tellphone', type: 'text', placeholder: '회사 전화번호', side: 'right' },
];

const step2InputsForTypeB = [
  { name: 'company', type: 'text', placeholder: '기업명', side: 'left' },
  { name: 'businessNumber', type: 'text', placeholder: '사업자번호', side: 'left' },
  { name: 'businessName', type: 'text', placeholder: '사업자명', side: 'left' },
  { name: 'openingDate', type: 'text', placeholder: '개업일', side: 'left' },
  { name: 'adress', type: 'text', placeholder: '기업주소', side: 'right' },
  { name: 'email', type: 'text', placeholder: '이메일', side: 'right' },
  { name: 'tellphone', type: 'text', placeholder: '기업전화번호', side: 'right' },
];

const SignUp = () => {
  const [formStep, setFormStep] = useState(1);
  const [formData1, setFormData1] = useState({
    gender: 'men',
    type: 'A',
  });
  const [formData2, setFormData2] = useState({});
  const [selectedType, setSelectedType] = useState('A');

  const handleChange = (e, step) => {
    const { name, value } = e.target;
    if (step === 1) setFormData1((prev) => ({ ...prev, [name]: value }));
    else if (step === 2) setFormData2((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setSelectedType(value);
    setFormData1((prev) => ({ ...prev, type: value }));
    setFormData2({});
  };

  //다음 버튼
  const handleNext = () => {
    setFormStep((prev) => prev + 1);
  };
  //이전 버튼
  const handlePrev = () => {
    if (formStep > 1) {
      setFormStep((prev) => prev - 1);
      setFormData2({});
    }
  };

  const handleSubmit = () => {
    console.log('1번 폼 데이터', formData1);
    console.log('2번 폼 데이터', formData2);
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
            <>
              <InputWrap>
                {Array.from({ length: Math.ceil(step1Inputs.length / 2) }, (_, i) => {
                  const left = step1Inputs[i];
                  const right = step1Inputs[i + Math.ceil(step1Inputs.length / 2)];

                  return (
                    <React.Fragment key={i}>
                      {/* 왼쪽 영역 */}
                      <div>
                        <Label htmlFor={left.name}>{left.placeholder}</Label>
                        <InputBox
                          name={left.name}
                          type={left.type}
                          placeholder={left.placeholder}
                          value={formData1[left.name] || ''}
                          onChange={(e) => handleChange(e, 1)}
                          variant="yellow"
                        />
                      </div>

                      {/* 가운데 간격 */}
                      <div />

                      {/* 오른쪽 영역 */}
                      {right ? (
                        <div>
                          <Label htmlFor={right.name}>{right.placeholder}</Label>
                          <InputBox
                            name={right.name}
                            type={right.type}
                            placeholder={right.placeholder}
                            value={formData1[right.name] || ''}
                            onChange={(e) => handleChange(e, 1)}
                            variant="yellow"
                          />
                        </div>
                      ) : (
                        <div /> // 오른쪽이 없으면 빈 칸
                      )}
                    </React.Fragment>
                  );
                })}
                {/* 라디오 버튼 포함 */}
                <div>
                  <Label>성별</Label>
                  <RadioGroup>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="men"
                        checked={formData1.gender === 'men'}
                        onChange={(e) => handleChange(e, 1)}
                      />
                      남성
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="women"
                        checked={formData1.gender === 'women'}
                        onChange={(e) => handleChange(e, 1)}
                      />
                      여성
                    </label>
                  </RadioGroup>
                </div>
                <div /> {/* 중간 여백 */}
                <div>
                  <Label>회원 유형</Label>
                  <RadioGroup>
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value="A"
                        checked={formData1.type === 'A'}
                        onChange={handleRadioChange}
                      />
                      직원
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value="B"
                        checked={formData1.type === 'B'}
                        onChange={handleRadioChange}
                      />
                      기업
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value="C"
                        checked={formData1.type === 'C'}
                        onChange={handleRadioChange}
                      />
                      워케이션 업체
                    </label>
                  </RadioGroup>
                </div>
              </InputWrap>
            </>
          )}

          {/* STEP 2 - 직원 */}
          {formStep === 2 && formData1.type === 'A' && (
            <>
              <InputWrap>
                {Array.from({ length: Math.ceil(step2InputsForTypeA.length / 2) }, (_, i) => {
                  const left = step2InputsForTypeA[i];
                  const right = step2InputsForTypeA[i + Math.ceil(step2InputsForTypeA.length / 2)];

                  return (
                    <React.Fragment key={i}>
                      {/* 왼쪽 영역 */}
                      <div>
                        <Label htmlFor={left.name}>{left.placeholder}</Label>
                        <InputBox
                          name={left.name}
                          type={left.type}
                          placeholder={left.placeholder}
                          value={formData2[left.name] || ''}
                          onChange={(e) => handleChange(e, 2)}
                          variant="yellow"
                        />
                      </div>

                      {/* 가운데 간격 */}
                      <div />

                      {/* 오른쪽 영역 */}
                      {right ? (
                        <div>
                          <Label htmlFor={right.name}>{right.placeholder}</Label>
                          <InputBox
                            name={right.name}
                            type={right.type}
                            placeholder={right.placeholder}
                            value={formData2[right.name] || ''}
                            onChange={(e) => handleChange(e, 2)}
                            variant="yellow"
                          />
                        </div>
                      ) : (
                        <div /> // 오른쪽이 없으면 빈 칸
                      )}
                    </React.Fragment>
                  );
                })}
              </InputWrap>
            </>
          )}

          {/* STEP 2 - 회사 */}
          {formStep === 2 && formData1.type === 'B' && (
            <>
              <InputWrap>
                {Array.from({ length: Math.ceil(step2InputsForTypeB.length / 2) }, (_, i) => {
                  const left = step2InputsForTypeB[i];
                  const right = step2InputsForTypeB[i + Math.ceil(step2InputsForTypeB.length / 2)];

                  return (
                    <React.Fragment key={i}>
                      {/* 왼쪽 영역 */}
                      <div>
                        <Label htmlFor={left.name}>{left.placeholder}</Label>
                        <InputBox
                          name={left.name}
                          type={left.type}
                          placeholder={left.placeholder}
                          value={formData2[left.name] || ''}
                          onChange={(e) => handleChange(e, 2)}
                          variant="yellow"
                        />
                      </div>

                      {/* 가운데 간격 */}
                      <div />

                      {/* 오른쪽 영역 */}
                      {right ? (
                        <div>
                          <Label htmlFor={right.name}>{right.placeholder}</Label>
                          <InputBox
                            name={right.name}
                            type={right.type}
                            placeholder={right.placeholder}
                            value={formData2[right.name] || ''}
                            onChange={(e) => handleChange(e, 2)}
                            variant="yellow"
                          />
                        </div>
                      ) : (
                        <div /> // 오른쪽이 없으면 빈 칸
                      )}
                    </React.Fragment>
                  );
                })}
              </InputWrap>
            </>
          )}

          {/* 버튼 영역 */}
          <BtnFlex>
            {/* 타입 A, 1단계 → 취소 & 다음 */}
            {formStep === 1 && (
              <>
                <Btn onClick={() => window.history.back()}>취소</Btn>
                <Btn onClick={selectedType === 'C' ? handleSubmit : handleNext}>
                  {selectedType === 'C' ? '완료' : '다음'}
                </Btn>
              </>
            )}

            {formStep === 2 && (
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

const InputWrap = styled.div`
  display: grid;
  grid-template-columns: 40% 20% 40%;
  row-gap: ${({ theme }) => theme.spacing.s5};
  column-gap: ${({ theme }) => theme.spacing.s0};
  margin-top: ${({ theme }) => theme.spacing.s5};
  width: 100%;
`;

const InputBox = styled.input`
  ${({ variant }) => {
    switch (variant) {
      case 'yellow':
        return Input.InputYellow;
      case 'gray':
        return Input.InputGray;
      case 'orange':
        return Input.InputOrange;
      default:
        return '';
    }
  }};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.s3};
  box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.25);
  margin: ${({ theme }) => theme.spacing.s0};
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

const RadioGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.s10};
  margin: ${({ theme }) => theme.spacing.s9} ${({ theme }) => theme.spacing.s0};

  label {
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.s2};
  }

  input[type='radio'] {
    width: 18px;
    height: 18px;
    accent-color: ${({ theme }) => theme.colors.primary}; /* 브라우저 지원 시 테마색 */
  }
`;

const Label = styled.label`
  display: block;
  text-align: left;
  margin-bottom: ${({ theme }) => theme.spacing.s2};
  margin-left: ${({ theme }) => theme.spacing.s3};
`;

export default SignUp;
