import React, { useState, useRef } from 'react';
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
import api from '../../api/axios';
import { ButtonBorder } from '../../styles/Button.styles';

const SignUp = () => {
  const [formStep, setFormStep] = useState(1);
  const [formData1, setFormData1] = useState({
    gender: 'M',
    type: 'employee',
  });
  const [formData2, setFormData2] = useState({});
  const [selectedType, setSelectedType] = useState('employee');
  const { validateStep } = useValidation();
  const companyNameTimeout = useRef();
  const [companySearchResults, setCompanySearchResults] = useState([]);
  const [isPostcodeReady, setIsPostcodeReady] = useState(false);

  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    script.onload = () => setIsPostcodeReady(true);
    script.onerror = () => console.error('주소 검색 스크립트 로드 실패');
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

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

    if (formData1.user_pwd !== formData1.user_pwd_check) {
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

  // 회사명 keyup 핸들러
  const handleCompanyNameKeyUp = (e) => {
    const value = e.target.value;
    if (companyNameTimeout.current) clearTimeout(companyNameTimeout.current);
    companyNameTimeout.current = setTimeout(async () => {
      if (!value) {
        setCompanySearchResults([]);
        return;
      }
      try {
        const data = await memberService.searchCompany(value);
        console.log('회사 검색 결과:', data); // 응답 구조 확인
        setCompanySearchResults(Array.isArray(data) ? data : []);
      } catch (err) {
        setCompanySearchResults([]);
        console.error('회사명 검색 에러:', err);
      }
    }, 500);
  };

  // Dropdown item click handler
  const handleCompanySelect = (company) => {
    console.log('선택된 회사 정보:', company); // 선택된 회사 데이터 구조 확인
    setFormData2((prev) => ({
      ...prev,
      company_name: company.company_name,
      companyNo: company.company_no,
      address: company.company_address, // 회사 주소도 함께 설정
    }));
    setCompanySearchResults([]);
  };

  const handleAddressSearch = () => {
    if (!isPostcodeReady) {
      alert('주소 검색 스크립트가 아직 준비되지 않았습니다.');
      return;
    }
    new window.daum.Postcode({
      oncomplete: function (data) {
        const addr = data.address;
        setFormData1((prev) => ({ ...prev, address: addr }));
      },
    }).open();
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
                        ) : left.name === 'address' ? (
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <InputBox
                              name="address"
                              type="text"
                              value={formData1.address || ''}
                              readOnly
                              placeholder="주소"
                              variant="yellow"
                            />
                            <AddressSearchButton
                              type="button"
                              onClick={handleAddressSearch}
                              disabled={!isPostcodeReady}
                            >
                              검색
                            </AddressSearchButton>
                          </div>
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
                          ) : right.name === 'address' ? (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <InputBox
                                name="address"
                                type="text"
                                value={formData1.address || ''}
                                readOnly
                                placeholder="주소"
                                variant="yellow"
                              />
                              <AddressSearchButton
                                type="button"
                                onClick={handleAddressSearch}
                                disabled={!isPostcodeReady}
                              >
                                검색
                              </AddressSearchButton>
                            </div>
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
                      value="M"
                      checked={formData1.gender === 'M'}
                      onChange={(e) => handleChange(e, 1)}
                    />
                    <CustomRadioButton
                      label="여성"
                      name="gender"
                      value="W"
                      checked={formData1.gender === 'W'}
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
                        <Label htmlFor={left.name}>
                          {left.name === 'business_id' ? '사업자번호' : left.placeholder}
                        </Label>
                        {left.name === 'company_name' ? (
                          <div style={{ position: 'relative' }}>
                            <InputBox
                              name={left.name}
                              type={left.type}
                              placeholder={left.placeholder}
                              value={formData2.company_name || ''}
                              onChange={(e) => handleChange(e, 2)}
                              onKeyUp={handleCompanyNameKeyUp}
                              autoComplete="off"
                              variant="yellow"
                            />
                            {companySearchResults.length > 0 && (
                              <CompanyDropdown>
                                {companySearchResults.map((company) => (
                                  <DropdownItem key={company.company_no} onClick={() => handleCompanySelect(company)}>
                                    {company.company_name}
                                  </DropdownItem>
                                ))}
                              </CompanyDropdown>
                            )}
                          </div>
                        ) : left.name === 'address' ? (
                          <InputBox
                            name={left.name}
                            type={left.type}
                            placeholder={left.placeholder}
                            value={formData2[left.name] || ''}
                            onChange={(e) => handleChange(e, 2)}
                            variant="yellow"
                            readOnly
                          />
                        ) : (
                          <InputBox
                            name={left.name}
                            type={left.type}
                            placeholder={left.placeholder}
                            value={formData2[left.name] || ''}
                            onChange={(e) => handleChange(e, 2)}
                            variant="yellow"
                          />
                        )}
                      </div>

                      {/* 가운데 간격 */}
                      <div />

                      {/* 오른쪽 영역 */}
                      {right ? (
                        <div>
                          <Label htmlFor={right.name}>
                            {right.name === 'business_id' ? '사업자번호' : right.placeholder}
                          </Label>
                          {right.name === 'company_name' ? (
                            <div style={{ position: 'relative' }}>
                              <InputBox
                                name={right.name}
                                type={right.type}
                                placeholder={right.placeholder}
                                value={formData2.company_name || ''}
                                onChange={(e) => handleChange(e, 2)}
                                onKeyUp={handleCompanyNameKeyUp}
                                autoComplete="off"
                                variant="yellow"
                              />
                              {companySearchResults.length > 0 && (
                                <CompanyDropdown>
                                  {companySearchResults.map((company) => (
                                    <DropdownItem key={company.company_no} onClick={() => handleCompanySelect(company)}>
                                      {company.company_name}
                                    </DropdownItem>
                                  ))}
                                </CompanyDropdown>
                              )}
                            </div>
                          ) : right.name === 'address' ? (
                            <InputBox
                              name={right.name}
                              type={right.type}
                              placeholder={right.placeholder}
                              value={formData2[right.name] || ''}
                              onChange={(e) => handleChange(e, 2)}
                              variant="yellow"
                              readOnly
                            />
                          ) : (
                            <InputBox
                              name={right.name}
                              type={right.type}
                              placeholder={right.placeholder}
                              value={formData2[right.name] || ''}
                              onChange={(e) => handleChange(e, 2)}
                              variant="yellow"
                            />
                          )}
                          {left.name === 'open_date' ? (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <InputBox
                                name={left.name}
                                type={left.type}
                                placeholder={left.placeholder}
                                value={formData2[left.name] || ''}
                                onChange={(e) => handleChange(e, 2)}
                                variant="yellow"
                              />
                              <Btn type="button" style={{ marginLeft: '8px', height: '40px' }}>
                                부서 등록
                              </Btn>
                            </div>
                          ) : (
                            <InputBox
                              name={left.name}
                              type={left.type}
                              placeholder={left.placeholder}
                              value={formData2[left.name] || ''}
                              onChange={(e) => handleChange(e, 2)}
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
                        <Label htmlFor={left.name}>
                          {left.name === 'business_id' ? '사업자번호' : left.placeholder}
                        </Label>
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
                          <Label htmlFor={right.name}>
                            {right.name === 'business_id' ? '사업자번호' : right.placeholder}
                          </Label>
                          {right.type === 'button' ? (
                            <Btn type="button" style={{ width: '100%' }}>
                              {right.placeholder}
                            </Btn>
                          ) : right.name === 'company_name' ? (
                            <div style={{ position: 'relative' }}>
                              <InputBox
                                name={right.name}
                                type={right.type}
                                placeholder={right.placeholder}
                                value={formData2.company_name || ''}
                                onChange={(e) => handleChange(e, 2)}
                                onKeyUp={handleCompanyNameKeyUp}
                                autoComplete="off"
                                variant="yellow"
                              />
                              {companySearchResults.length > 0 && (
                                <CompanyDropdown>
                                  {companySearchResults.map((company) => (
                                    <DropdownItem key={company.company_no} onClick={() => handleCompanySelect(company)}>
                                      {company.company_name}
                                    </DropdownItem>
                                  ))}
                                </CompanyDropdown>
                              )}
                            </div>
                          ) : right.name === 'address' ? (
                            <InputBox
                              name={right.name}
                              type={right.type}
                              placeholder={right.placeholder}
                              value={formData2[right.name] || ''}
                              onChange={(e) => handleChange(e, 2)}
                              variant="yellow"
                              readOnly
                            />
                          ) : (
                            <InputBox
                              name={right.name}
                              type={right.type}
                              placeholder={right.placeholder}
                              value={formData2[right.name] || ''}
                              onChange={(e) => handleChange(e, 2)}
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

const CompanyDropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #fffbe6;
  border: 1px solid #ffeb8c;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 10;
  max-height: 220px; /* 44px * 5 = 220px, show up to 5 items */
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
`;
const DropdownItem = styled.li`
  padding: 10px 16px;
  height: 44px;
  cursor: pointer;
  &:hover {
    background: #fff3b0;
  }
`;

const AddressSearchButton = styled.button`
  height: 52.41px; /* match InputBox height from DatePicker styles */
  min-width: 80px;
  padding: 0 12px;
  background: #feffe0;
  border: 3px solid #dda900;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-family: ${({ theme }) => theme.fontFamily.primary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.black};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default SignUp;
