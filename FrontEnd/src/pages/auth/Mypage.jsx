import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Input from '../../styles/Input';
import { InputRadio } from '../../styles/Input.styles';
import useAuthStore from '../../store/authStore';
import btn from '../../styles/Button';
import memberService from '../../api/members';
import { usePosition } from '../../hooks/usePosition';
import Popup from '../../components/auth/Popup';
import Swal from 'sweetalert2';
import { useValidatePassword } from '../../hooks/useAuth';

const Mypage = () => {
  const { loginUser } = useAuthStore();
  const [departmentSearchResults, setDepartmentSearchResults] = useState([]);
  const [companySearchResults, setCompanySearchResults] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [doUpdate, setDoUpdate] = useState(false);
  const [isPostcodeReady, setIsPostcodeReady] = useState(false);
  const companyNameTimeout = useRef();

  const [showInput, setShowInput] = useState(false);
  const [departments, setDepartments] = useState([]);
  const handleDeptBtnClick = () => {
    if (showInput) {
      const departmentsArray = Object.entries(departments).map(([key, deptName]) => ({
        department_no: parseInt(key) > 0 ? parseInt(key) : null,
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
            departments: mappedDepartments,
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

  const { validateCurrentPassword } = useValidatePassword();

  if (!loginUser) {
    return <div style={{ textAlign: 'center' }}>로딩중...</div>;
  }

  const handleCompanySelect = (company) => {
    // 현재 회사와 다른 회사를 선택했을 때만 확인 다이얼로그 표시
    if (userInfo.company_no && userInfo.company_no !== company.company_no) {
      Swal.fire({
        title: '정말 회사를 바꾸시겠습니까?',
        text: '회사를 바꾸면 회사의 승인을 새로 받아야하며 해당 회사의 일반 직원이 되게됩니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '확인',
        cancelButtonText: '취소',
      }).then((result) => {
        if (result.isConfirmed) {
          // 승인하면 회사 변경
          setUserInfo((prev) => ({
            ...prev,
            position: null,
            department_name: null,
            company_no: company.company_no,
            company_name: company.company_name,
          }));
          setCompanySearchResults([]);
        } else {
          // 취소하면 이전 값으로 되돌리기 위해 검색 결과만 초기화
          setCompanySearchResults([]);
        }
      });
    } else {
      // 같은 회사이거나 처음 선택하는 경우 바로 변경
      setUserInfo((prev) => ({
        ...prev,
        company_no: company.company_no,
        company_name: company.company_name,
      }));
      setCompanySearchResults([]);
    }
  };

  const handleDepartmentClick = async () => {
    try {
      const data = await memberService.searchDepartment(userInfo.company_no);
      setDepartmentSearchResults(data);
    } catch (err) {
      console.error(err);
      setDepartmentSearchResults([]);
    }
  };

  // 공통 입력 onChange 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 현재 비밀번호 검증
    const isPasswordValid = await validateCurrentPassword();
    if (!isPasswordValid) return;

    try {
      let submitData = {
        user_pwd: userInfo.user_pwd,
        name: userInfo.name,
        address: userInfo.address,
        email: userInfo.email,
        phone: userInfo.phone,
        company_profile_update: {
          company_no: userInfo.company_no,
          department_name: userInfo.department_name,
          position: userInfo.position,
          company_email: userInfo.company_email,
          company_phone: userInfo.company_phone,
        },
        company_update: {
          company_name: userInfo.company_name,
          company_address: userInfo.company_address,
          business_email: userInfo.business_email,
          company_tel: userInfo.company_tel,
          departments: userInfo.departments,
        },
      };

      console.log(submitData);
      await memberService.updateMember(submitData);

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
        text: err,
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
        setCompanySearchResults(Array.isArray(data) ? data : []);
      } catch (err) {
        setCompanySearchResults([]);
        console.error('회사명 검색 에러:', err);
      }
    }, 330);
  };

  return (
    <>
      <Content>
        <TitleBox>
          <Title>마이페이지</Title>
          <WithdrawButton
            onClick={async () => {
              const isPasswordValid = await validateCurrentPassword();
              if (!isPasswordValid) return;
              const result = await Swal.fire({
                title: '정말 탈퇴하시겠습니까?',
                text: '탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: '탈퇴',
                cancelButtonText: '취소',
              });
              if (result.isConfirmed) {
                await memberService.delete();
                Swal.fire({
                  icon: 'success',
                  title: '탈퇴 완료',
                  text: '회원 탈퇴가 성공적으로 처리되었습니다.',
                  confirmButtonColor: '#3085d6',
                }).then(() => {
                  localStorage.removeItem('token');
                  window.location.href = '/';
                });
              }
            }}
          >
            탈퇴
          </WithdrawButton>
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
                onClick={doUpdate ? () => handleAddressSearch('address') : undefined}
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
            {loginUser.role === 'MASTER' && doUpdate && (
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
                {loginUser?.role === 'MASTER' && (
                  <InputGroup>
                    <InputName>회사명</InputName>
                    <InputText
                      style={Input.InputGray}
                      type="text"
                      name="company_name"
                      value={userInfo.company_name || ''}
                      onChange={handleInputChange}
                      readOnly={!doUpdate}
                      autoComplete="off"
                    />
                  </InputGroup>
                )}
                {(loginUser?.role === 'EMPLOYEE' || loginUser?.role === 'MANAGER') && (
                  <InputGroup style={{ position: 'relative' }}>
                    <InputName>회사명</InputName>
                    <InputText
                      style={Input.InputGray}
                      type="text"
                      name="company_name"
                      value={userInfo.company_name || ''}
                      onChange={handleInputChange}
                      onKeyUp={handleCompanyNameKeyUp}
                      readOnly={!doUpdate}
                      autoComplete="off"
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
                      onClick={loginUser?.role !== 'MASTER' && doUpdate ? handlePositionClick : undefined}
                      readOnly
                    />
                    {positionList.length > 0 && (
                      <CompanyDropdown>
                        {positionList.map((position, index) => (
                          <DropdownItem
                            key={index}
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
                      onClick={doUpdate ? () => handleAddressSearch('company_address') : undefined}
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
              <button
                style={btn.buttonYbShadow}
                onClick={() => {
                  window.location.reload();
                }}
              >
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
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Title = styled.p`
  font-size: ${({ theme }) => theme.fontSizes[`4xl`]};
`;

const WithdrawButton = styled.button`
  background-color: #d33;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #b91c1c;
  }
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
