import React, { useState } from 'react';
import styled from 'styled-components';
import loginBg from '../../assets/loginBgImg.jpg';
import logo from '../../assets/LoginLogo.png';
import logoText from '../../assets/LoginText.png';
import Input from '../../styles/Input';
import CustomRadioButton from '../../components/common/CustomRadioButton';
import memberService from '../../api/members';
import { inputsByStep } from '../../components/auth/authInput';
import useValidation from '../../hooks/useAuth';
import CustomDatePicker from '../../components/common/DatePicker';

const SignUp = () => {
  const [formStep, setFormStep] = useState(1);
  const [formData1, setFormData1] = useState({
    gender: 'men',
    type: 'employee',
  });
  const [formData2, setFormData2] = useState({});
  const [selectedType, setSelectedType] = useState('employee');
  const { validateStep } = useValidation();

  // 입력 필드 변경 핸들러
  const handleChange = (e, step) => {
    const { name, value } = e.target;
    if (step === 1) setFormData1((prev) => ({ ...prev, [name]: value }));
    else if (step === 2) setFormData2((prev) => ({ ...prev, [name]: value }));
  };

  // 라디오 버튼 변경 핸들러
  const handleRadioChange = (e) => {
    const { value } = e.target;
    setSelectedType(value);
    setFormData1((prev) => ({ ...prev, type: value }));
    setFormData2({});
  };

  // 다음 버튼 핸들러
  const handleNext = async () => {
    const isValid = await validateStep(formData1, 1);
    if (!isValid) return;
    setFormStep((prev) => prev + 1);
  };

  // 이전 버튼 핸들러
  const handlePrev = () => {
    if (formStep > 1) {
      setFormStep((prev) => prev - 1);
      setFormData2({});
    }
  };

  // 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData1.userPwd !== formData1.userPwdCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    let isValidStep2 = true;
    if (formStep === 2) {
      // 2단계일 때만 formData2 유효성 검사
      isValidStep2 = await validateStep(formData2, 2, `type${selectedType}`);
      if (!isValidStep2) return;
    }

    try {
      await memberService.register(formData1, formData2);
      alert('회원가입이 완료되었습니다.');
      window.location.href = '/login';
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
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
            <>
              <InputWrap>
                {Array.from({ length: Math.ceil(inputsByStep.step1.length / 2) }, (_, i) => {
                  const left = inputsByStep.step1[i];
                  const right = inputsByStep.step1[i + Math.ceil(inputsByStep.step1.length / 2)];

                  return (
                    <React.Fragment key={i}>
                      {/* 왼쪽 영역 */}
                      <div>
                        <Label htmlFor={left.name}>{left.placeholder}</Label>
                        {left.name === 'birthday' ? (
                          <StyledDatePickerWrapper>
                            <CustomDatePicker
                              selected={formData1.birthday || null}
                              onChange={(date) => setFormData1((prev) => ({ ...prev, birthday: date }))}
                            />
                          </StyledDatePickerWrapper>
                        ) : (
                          <InputBox
                            name={left.name}
                            type={left.type}
                            placeholder={left.placeholder}
                            value={formData1[left.name] || ''}
                            onChange={(e) => handleChange(e, 1)}
                            variant="yellow"
                          />
                        )}
                      </div>

                      {/* 가운데 간격 */}
                      <div />

                      {/* 오른쪽 영역 */}
                      {right ? (
                        <div>
                          <Label htmlFor={right.name}>{right.placeholder}</Label>
                          {right.name === 'birthday' ? (
                            <StyledDatePickerWrapper>
                              <CustomDatePicker
                                selected={formData1.birthday || null}
                                onChange={(date) => setFormData1((prev) => ({ ...prev, birthday: date }))}
                              />
                            </StyledDatePickerWrapper>
                          ) : (
                            <InputBox
                              name={right.name}
                              type={right.type}
                              placeholder={right.placeholder}
                              value={formData1[right.name] || ''}
                              onChange={(e) => handleChange(e, 1)}
                              variant="yellow"
                            />
                          )}
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
                    <CustomRadioButton
                      label="남성"
                      name="gender"
                      value="men"
                      checked={formData1.gender === 'men'}
                      onChange={(e) => handleChange(e, 1)}
                    />
                    <CustomRadioButton
                      label="여성"
                      name="gender"
                      value="women"
                      checked={formData1.gender === 'women'}
                      onChange={(e) => handleChange(e, 1)}
                    />
                  </RadioGroup>
                </div>{' '}
                <div /> {/* 중간 여백 */}
                <div>
                  <Label>회원 유형</Label>
                  <RadioGroup>
                    <CustomRadioButton
                      label="직원"
                      name="type"
                      value="employee"
                      checked={formData1.type === 'employee'}
                      onChange={handleRadioChange}
                    />
                    <CustomRadioButton
                      label="기업"
                      name="type"
                      value="master"
                      checked={formData1.type === 'master'}
                      onChange={handleRadioChange}
                    />
                    <CustomRadioButton
                      label="워케이션 업체"
                      name="type"
                      value="worcation"
                      checked={formData1.type === 'worcation'}
                      onChange={handleRadioChange}
                    />
                  </RadioGroup>
                </div>
              </InputWrap>
            </>
          )}

          {/* STEP 2 - 직원 */}
          {formStep === 2 && formData1.type === 'employee' && (
            <>
              <InputWrap>
                {Array.from({ length: Math.ceil(inputsByStep.step2.typeA.length / 2) }, (_, i) => {
                  const left = inputsByStep.step2.typeA[i];
                  const right = inputsByStep.step2.typeA[i + Math.ceil(inputsByStep.step2.typeA.length / 2)];

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
          {formStep === 2 && formData1.type === 'master' && (
            <>
              <InputWrap>
                {Array.from({ length: Math.ceil(inputsByStep.step2.typeB.length / 2) }, (_, i) => {
                  const left = inputsByStep.step2.typeB[i];
                  const right = inputsByStep.step2.typeB[i + Math.ceil(inputsByStep.step2.typeB.length / 2)];

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
                <Btn onClick={selectedType === 'worcation' ? handleSubmit : handleNext}>
                  {selectedType === 'worcation' ? '완료' : '다음'}
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
`;

const Label = styled.label`
  display: block;
  text-align: left;
  margin-bottom: ${({ theme }) => theme.spacing.s2};
  margin-left: ${({ theme }) => theme.spacing.s1};
`;

const StyledDatePickerWrapper = styled.div`
  .react-datepicker__input-container input {
    box-sizing: border-box;
    max-width: 100%;
    width: 401.92px;
    height: 52.41px;
    background: #ffffff;
    border: 3px solid #ffeb8c;
    border-radius: 10px;
    color: black;
    padding: 0 12px;
    font-size: ${({ theme }) => theme.fontSizes.base};
    outline: none;
    margin: 0;
    box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.25);
  }
  .react-datepicker__input-container input::placeholder {
    color: #adadad;
    opacity: 1;
  }
  .react-datepicker__input-container input:focus {
    border-color: #ffeb8c;
    background: #fff;
  }
`;

export default SignUp;
