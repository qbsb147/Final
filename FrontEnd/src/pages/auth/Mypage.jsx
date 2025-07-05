import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Input from '../../styles/Input';
import { InputRadio } from '../../styles/Input.styles';
import useAuthStore from '../../store/authStore';
import api from '../../api/axios';
import btn from '../../styles/Button';
import memberService from '../../api/members';
import { validateMypageForm } from '../../hooks/useAuth';
import * as yup from 'yup';
import { usePosition } from '../../hooks/usePosition';
import Popup from '../../components/auth/Popup';
import Swal from 'sweetalert2';

const Mypage = () => {
  const { loginUser } = useAuthStore();
  const [departmentSearchResults, setDepartmentSearchResults] = useState([]);

  const [userInfo, setUserInfo] = useState({});
  const [doUpdate, setDoUpdate] = useState(false);
  const [isPostcodeReady, setIsPostcodeReady] = useState(false);
  const positions = [
    { position_name: '사원' },
    { position_name: '주임' },
    { position_name: '대리' },
    { position_name: '과장' },
    { position_name: '차장' },
    { position_name: '부장' },
    { position_name: '이사' },
    { position_name: '상무' },
    { position_name: '전무' },
    { position_name: '부사장' },
  ];
  const [showInput, setShowInput] = useState(false);
  const [departments, setDepartments] = useState([]);
  const handleDeptBtnClick = () => {
    if (showInput) {
      // departments 객체를 서버 형식에 맞게 변환
      const departmentsArray = Object.entries(departments).map(([key, deptName]) => ({
        department_no: parseInt(key) > 0 ? parseInt(key) : null, // 음수 키는 새로 추가된 부서
        department_name: deptName,
      }));
      setUserInfo((prev) => ({ ...prev, departments: departmentsArray }));
    }
    setShowInput(!showInput);
  };

  const { positionList, selectedPosition, setSelectedPosition, handlePositionClick, handlePositionSelect } =
    usePosition(userInfo.position || '');

  useEffect(() => {
    setSelectedPosition(userInfo.position || '');
  }, [userInfo.position, setSelectedPosition]);

  useEffect(() => {
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

  useEffect(() => {
    if (!loginUser?.user_id) return;

    const fetchUserInfo = async () => {
      try {
        const memberData = await memberService.getDetail();
        console.log(memberData);

        let mappedData = {};
        if (loginUser.role === 'WORCATION') {
          mappedData = {
            user_no: memberData.user_no,
            user_id: memberData.user_id,
            email: memberData.email,
            name: memberData.name,
            phone: memberData.phone,
            address: memberData.address,
            birthday: memberData.birthday,
            gender: memberData.gender,
            registration_role: memberData.role,
          };
        } else if (loginUser.role === 'MASTER') {
          const departmentsArray = memberData?.company_info?.departments || [];
          // department_name을 값으로, department_no를 인덱스로 하는 객체 생성
          const mappedDepartments = {};
          departmentsArray.forEach((dept) => {
            mappedDepartments[dept.department_no] = dept.department_name;
          });

          mappedData = {
            user_no: memberData.user_no,
            user_id: memberData.user_id,
            email: memberData.email,
            name: memberData.name,
            phone: memberData.phone,
            address: memberData.address,
            birthday: memberData.birthday,
            gender: memberData.gender,
            registration_role: memberData.role,
            company_name: memberData?.company_info?.company_name || '',
            company_address: memberData?.company_info?.company_address || '',
            business_email: memberData?.company_info?.business_email || '',
            company_tel: memberData?.company_info?.company_tel || '',
            departments: memberData?.company_info?.departments || '',
          };

          setDepartments(mappedDepartments);
        } else if (loginUser.role === 'EMPLOYEE' || loginUser.role === 'MANAGER') {
          mappedData = {
            user_no: memberData.user_no,
            user_id: memberData.user_id,
            email: memberData.email,
            phone: memberData.phone,
            name: memberData.name,
            address: memberData.address,
            birthday: memberData.birthday,
            gender: memberData.gender,
            registration_role: memberData.role,
            company_no: memberData.company_profile_info?.company_info?.company_no || '',
            company_name: memberData.company_profile_info?.company_info?.company_name || '',
            department_name: memberData.company_profile_info?.department_name || '',
            position: memberData.company_profile_info?.position || '',
            company_email: memberData.company_profile_info?.company_email || '',
            company_phone: memberData.company_profile_info?.company_phone || '',
          };
        }

        // birthday로 age 계산 (한국식 나이)
        if (mappedData.birthday) {
          const birth = new Date(mappedData.birthday);
          const today = new Date();
          const koreanAge = today.getFullYear() - birth.getFullYear() + 1;
          mappedData.age = koreanAge;
        } else {
          mappedData.age = '';
        }

        setUserInfo(mappedData);
      } catch (err) {
        console.error('회원정보 불러오기 실패:', err);
      }
    };

    fetchUserInfo();
  }, [loginUser]);

  if (!loginUser) {
    return <div style={{ textAlign: 'center' }}>로딩중...</div>;
  }
  const handleDepartmentClick = async (e) => {
    try {
      const data = await memberService.searchDepartment(userInfo.company_no);
      setDepartmentSearchResults(data);
    } catch (err) {
      setDepartmentSearchResults([]);
    }
  };

  // 공통 입력 onChange 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  // 현재 비밀번호 검증 함수
  const validateCurrentPassword = async () => {
    const { value: currentPassword } = await Swal.fire({
      title: '현재 비밀번호 확인',
      text: '정보 수정을 위해 현재 비밀번호를 입력해주세요.',
      input: 'password',
      inputPlaceholder: '현재 비밀번호를 입력하세요',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      inputValidator: (value) => {
        if (!value) {
          return '현재 비밀번호를 입력해주세요!';
        }
      },
    });

    if (currentPassword) {
      try {
        // 현재 비밀번호 검증 API 호출 (백엔드에서 구현 필요)
        await memberService.validateCurrentPassword(currentPassword);
        return true;
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: '비밀번호 오류',
          text: '현재 비밀번호가 일치하지 않습니다.',
          confirmButtonColor: '#3085d6',
        });
        return false;
      }
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 현재 비밀번호 검증
    const isPasswordValid = await validateCurrentPassword();
    if (!isPasswordValid) return;

    const isValid = await validateMypageForm(userInfo, loginUser.role);
    if (!isValid) return;

    try {
      // departments가 객체 형태라면 서버 형식으로 변환
      let submitData = { ...userInfo };
      if (typeof userInfo.departments === 'object' && !Array.isArray(userInfo.departments)) {
        const departmentsArray = Object.entries(userInfo.departments).map(([key, deptName]) => ({
          department_no: parseInt(key) > 0 ? parseInt(key) : null,
          department_name: deptName,
        }));
        submitData.departments = departmentsArray;
      }

      await memberService.updateMember(loginUser.user_no, submitData);

      Swal.fire({
        icon: 'success',
        title: '수정 완료!',
        text: '회원정보가 성공적으로 수정되었습니다.',
        confirmButtonColor: '#3085d6',
      });

      setDoUpdate(false);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: '수정 실패',
        text: '회원정보 수정에 실패했습니다.',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  const handleAddressSearch = (addressType) => {
    if (!isPostcodeReady) {
      alert('주소 검색 스크립트가 아직 준비되지 않았습니다.');
      return;
    }
    new window.daum.Postcode({
      oncomplete: function (data) {
        const addr = data.address;
        setUserInfo((prev) => ({ ...prev, [addressType]: addr }));
      },
    }).open();
  };
  const handleDepartmentSelect = (department) => {
    setUserInfo((prev) => ({
      ...prev,
      department_name: department.department_name,
    }));
    setDepartmentSearchResults([]);
  };

  return (
    <>
      <Content>
        <TitleBox>
          <Title>마이페이지</Title>
        </TitleBox>
        <Form>
          {/* 첫 번째 박스: 기본 정보 */}
          <Box>
            <InputGroup>
              <InputName>아이디</InputName>
              <InputText style={Input.InputGray} type="text" name="user_id" value={userInfo.user_id || ''} readOnly />
            </InputGroup>
            {doUpdate && (
              <>
                <InputGroup>
                  <InputName>새로운 비밀번호</InputName>
                  <InputText
                    style={Input.InputGray}
                    type="password"
                    name="user_pwd"
                    value={userInfo.user_pwd || ''}
                    onChange={handleInputChange}
                    readOnly={!doUpdate}
                  />
                </InputGroup>
                <InputGroup>
                  <InputName>비밀번호 확인</InputName>
                  <InputText
                    style={Input.InputGray}
                    type="password"
                    name="user_pwd_check"
                    value={userInfo.user_pwd_check || ''}
                    onChange={handleInputChange}
                    readOnly={!doUpdate}
                  />
                </InputGroup>
              </>
            )}
            <InputGroup>
              <InputName>이메일</InputName>
              <InputText
                style={Input.InputGray}
                type="email"
                name="email"
                value={userInfo.email || ''}
                onChange={handleInputChange}
                readOnly={!doUpdate}
              />
            </InputGroup>
            <InputGroup>
              <InputName>핸드폰 번호</InputName>
              <InputText
                style={Input.InputGray}
                type="text"
                name="phone"
                value={userInfo.phone || ''}
                onChange={handleInputChange}
                readOnly={!doUpdate}
              />
            </InputGroup>
            <InputGroup>
              <InputName>이름</InputName>
              <InputText
                style={Input.InputGray}
                type="text"
                name="name"
                value={userInfo.name || ''}
                onChange={handleInputChange}
                readOnly={!doUpdate}
              />
            </InputGroup>
          </Box>
          {/* 두 번째 박스: 추가 정보 */}
          <Box>
            <InputGroup>
              <InputName>주소</InputName>
              <InputText
                style={Input.InputGray}
                type="text"
                name="address"
                value={userInfo.address || ''}
                onClick={doUpdate && (() => handleAddressSearch('address'))}
                readOnly
              />
            </InputGroup>
            <InputGroup>
              <InputName>나이</InputName>
              <InputText
                style={Input.InputGray}
                type="number"
                name="age"
                value={userInfo.age || ''}
                onChange={handleInputChange}
                readOnly
              />
            </InputGroup>
            <InputGroup>
              <InputName>성별</InputName>
              <RadioGroup>
                <InputRadio
                  type="radio"
                  name="gender"
                  value="M"
                  checked={userInfo.gender === 'M'}
                  onChange={handleInputChange}
                  disabled={true}
                />
                남성
                <InputRadio
                  type="radio"
                  name="gender"
                  value="W"
                  checked={userInfo.gender === 'W'}
                  onChange={handleInputChange}
                  disabled={!doUpdate}
                />{' '}
                여성
              </RadioGroup>
            </InputGroup>
            <InputGroup>
              <InputName>등록 유형</InputName>
              <RadioGroup>
                <InputRadio
                  type="radio"
                  name="registrationType"
                  value="employee"
                  checked={loginUser.role === 'EMPLOYEE' || loginUser.role === 'MANAGER'}
                  disabled={!doUpdate}
                />
                직원
                <InputRadio
                  type="radio"
                  name="registrationType"
                  value="master"
                  checked={loginUser.role === 'MASTER'}
                  disabled={!doUpdate}
                />
                기업
                <InputRadio
                  type="radio"
                  name="registrationType"
                  value="worcation"
                  checked={loginUser.role === 'WORCATION'}
                  disabled={!doUpdate}
                />
                워케이션 업체
              </RadioGroup>
            </InputGroup>
          </Box>
          {/* 세 번째 박스: 회사 정보 */}
          <Box>
            {loginUser.role === 'MASTER' && (
              <div style={{ marginBottom: '16px' }}>
                <InputName>부서등록</InputName>
                {showInput ? (
                  <>
                    <Popup
                      handleDeptBtnClick={handleDeptBtnClick}
                      departments={departments}
                      setDepartments={setDepartments}
                    />
                  </>
                ) : (
                  <Btn type="button" style={{ width: '100%' }} onClick={handleDeptBtnClick}>
                    부서 등록
                  </Btn>
                )}
              </div>
            )}

            {showInput ? (
              <></>
            ) : (
              <>
                {(loginUser?.role === 'MASTER' || loginUser?.role === 'EMPLOYEE' || loginUser?.role === 'MANAGER') && (
                  <InputGroup>
                    <InputName>회사명</InputName>
                    <InputText
                      style={Input.InputGray}
                      type="text"
                      name="company_name"
                      value={userInfo.company_name || ''}
                      onChange={handleInputChange}
                      readOnly={!doUpdate}
                    />
                  </InputGroup>
                )}
                {(loginUser?.role === 'EMPLOYEE' || loginUser?.role === 'MANAGER') && (
                  <InputGroup style={{ position: 'relative' }}>
                    <InputName>부서명</InputName>
                    <InputText
                      style={Input.InputGray}
                      type="text"
                      name="department_name"
                      value={userInfo.department_name || ''}
                      onClick={handleDepartmentClick}
                      readOnly
                    />
                    {doUpdate && (
                      <>
                        {departmentSearchResults.length > 0 && (
                          <CompanyDropdown>
                            {departmentSearchResults.map((department) => (
                              <DropdownItem
                                key={department.department_no}
                                onClick={() => handleDepartmentSelect(department)}
                              >
                                {department.department_name}
                              </DropdownItem>
                            ))}
                          </CompanyDropdown>
                        )}
                      </>
                    )}
                  </InputGroup>
                )}
                {(loginUser?.role === 'EMPLOYEE' || loginUser?.role === 'MANAGER' || loginUser?.role === 'MASTER') && (
                  <InputGroup style={{ position: 'relative' }}>
                    <InputName>직급</InputName>
                    <InputText
                      style={Input.InputGray}
                      type="text"
                      name="position"
                      value={loginUser?.role === 'MASTER' ? '대표' : selectedPosition}
                      onClick={!loginUser?.role === 'MASTER' && doUpdate ? handlePositionClick : undefined}
                      readOnly
                    />
                    {positionList.length > 0 && (
                      <CompanyDropdown>
                        {positionList.map((position) => (
                          <DropdownItem
                            key={position.position_no}
                            onClick={() => {
                              handlePositionSelect(position);
                              setSelectedPosition(position.position_name);
                              setUserInfo((prev) => ({ ...prev, position: position.position_name }));
                            }}
                          >
                            {position.position_name}
                          </DropdownItem>
                        ))}
                      </CompanyDropdown>
                    )}
                  </InputGroup>
                )}
                {loginUser?.role === 'MASTER' && (
                  <InputGroup>
                    <InputName>회사주소</InputName>
                    <InputText
                      style={Input.InputGray}
                      type="text"
                      name="company_address"
                      value={userInfo.company_address || ''}
                      onClick={doUpdate && (() => handleAddressSearch('company_address'))}
                      readOnly
                    />
                  </InputGroup>
                )}
                {loginUser?.role === 'MASTER' && (
                  <InputGroup>
                    <InputName>회사 이메일</InputName>
                    <InputText
                      style={Input.InputGray}
                      type="email"
                      name="business_email"
                      value={userInfo.business_email || ''}
                      onChange={handleInputChange}
                      readOnly={!doUpdate}
                    />
                  </InputGroup>
                )}
                {(loginUser?.role === 'MANAGER' || loginUser?.role === 'EMPLOYEE') && (
                  <InputGroup>
                    <InputName>사내 이메일</InputName>
                    <InputText
                      style={Input.InputGray}
                      type="email"
                      name="company_email"
                      value={userInfo.company_email || ''}
                      onChange={handleInputChange}
                      readOnly={!doUpdate}
                    />
                  </InputGroup>
                )}
                {(loginUser?.role === 'MANAGER' || loginUser?.role === 'EMPLOYEE') && (
                  <InputGroup>
                    <InputName>사내 전화번호</InputName>
                    <InputText
                      style={Input.InputGray}
                      type="text"
                      name="company_phone"
                      value={userInfo.company_phone || ''}
                      onChange={handleInputChange}
                      readOnly={!doUpdate}
                    />
                  </InputGroup>
                )}
                {loginUser?.role === 'MASTER' && (
                  <InputGroup>
                    <InputName>회사 전화번호</InputName>
                    <InputText
                      style={Input.InputGray}
                      type="text"
                      name="company_tel"
                      value={userInfo.company_tel || ''}
                      onChange={handleInputChange}
                      readOnly={!doUpdate}
                    />
                  </InputGroup>
                )}
              </>
            )}
          </Box>
        </Form>
        <ButnContent>
          <ButnBox>
            {doUpdate ? (
              <button style={btn.buttonYbShadow} onClick={() => setDoUpdate(false)}>
                취소
              </button>
            ) : (
              <button style={btn.buttonYbShadow}>이전</button>
            )}
            {doUpdate ? (
              <button style={btn.buttonWbShadow} onClick={handleSubmit}>
                완료
              </button>
            ) : (
              <button style={btn.buttonWbShadow} onClick={() => setDoUpdate(true)}>
                수정
              </button>
            )}
          </ButnBox>
        </ButnContent>
      </Content>
    </>
  );
};

const ButnContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
`;

const ButnBox = styled.div`
  width: 200px;
  display: flex;
  justify-content: space-between;
`;

const RadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const InputText = styled.input`
  width: 250px;
  height: 35px;
`;

const Box = styled.div``;

const InputGroup = styled.div`
  height: 90px;
`;

const Form = styled.form`
  display: flex;
  padding-top: 20px;
  justify-content: space-around;
`;

const Content = styled.div`
  width: 1100px;
  padding-left: 30px;
`;

const TitleBox = styled.div`
  display: flex;
  justify-content: left;
  width: 100%;
`;

const Title = styled.p`
  font-size: ${({ theme }) => theme.fontSizes[`4xl`]};
`;

const InputName = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-family: ${({ theme }) => theme.fontFamily.secondary};
  display: flex;
  justify-content: left;
`;
const CompanyDropdown = styled.ul`
  position: absolute;
  left: 0;
  width: 100%;
  background: #fffbe6;
  border: 1px solid #ffeb8c;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 10;
  max-height: 220px;
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
const Btn = styled.button`
  width: 100px;
  height: 52.41px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.black};
  border: none;
`;

export default Mypage;
