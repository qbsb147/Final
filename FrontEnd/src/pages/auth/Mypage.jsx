import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Input from '../../styles/Input';
import { InputRadio } from '../../styles/Input.styles';
import useAuthStore from '../../store/authStore';
import api from '../../api/axios';
import btn from '../../styles/Button';
import memberService from '../../api/members';

const Mypage = () => {
  const { loginUser } = useAuthStore();
  const [userInfo, setUserInfo] = useState(1);

  useEffect(() => {
    if (!loginUser?.user_id) return;

    const fetchUserInfo = async () => {
      //백엔드 연결 시 데이터 하나로 합쳐서 가져오는 작업 필요
      try {
        const memberData = await memberService.getMyPage();

        const mappedData = {
          // members에서 가져오는 필드
          user_no: memberData.user_no,
          user_id: memberData.user_id,
          password: memberData.user_pwd,
          email: memberData.email,
          name: memberData.name,
          address: memberData.address,
          age: memberData.age,
          gender: memberData.gender,
          registration_role: memberData.role,

          // companies에서 가져오는 필드
          company_no: memberData?.company_no,
          company_name: memberData?.company_name || '',
          company_address: memberData?.company_address || '',
          company_email: memberData?.company_email || '',
          company_phone: memberData?.company_tel || '',

          //companyProfiles에서 가져오는 필드
          company_profile_no: memberData?.company_profile_no,
          position: memberData?.position || '',
          department: memberData?.department || '',
        };

        setUserInfo(mappedData);
      } catch (err) {
        console.error('회원정보 불러오기 실패:', err);
      }
    };

    fetchUserInfo();
  }, [loginUser?.user_id]);

  if (!userInfo) return <div style={{ textAlign: 'center' }}>로딩중...</div>;

  // 공통 입력 onChange 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // 2. 데이터 분리
    const memberData = {
      user_no: userInfo.user_no,
      user_id: userInfo.user_id,
      email: userInfo.email,
      name: userInfo.name,
      address: userInfo.address,
      age: userInfo.age,
      gender: userInfo.gender,
    };
    const companyData = {
      company_name: userInfo.company_name,
      company_address: userInfo.company_address,
      company_email: userInfo.company_email,
      company_phone: userInfo.company_phone,
    };
    const companyProfileData = {
      position: userInfo.position,
      department: userInfo.department,
    };

    try {
      // json-server에서는 id(PK)로 접근해야 하므로 userInfo.id, userInfo.companyId, userInfo.companyProfileId 사용
      await api.put(`/members/${userInfo.user_no}`, memberData);
      await api.put(`/companies/${userInfo.company_id}`, companyData);
      await api.put(`/companyProfiles/${userInfo.company_profile_id}`, companyProfileData);
      alert('수정 완료!');
    } catch (err) {
      console.error(err);
      alert('수정 실패!');
    }
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
            <InputGroup>
              <InputName>비밀번호</InputName>
              <InputText
                style={Input.InputGray}
                type="password"
                name="password"
                value={userInfo.password || ''}
                onChange={handleInputChange}
              />
            </InputGroup>
            <InputGroup>
              <InputName>비밀번호 확인</InputName>
              <InputText
                style={Input.InputGray}
                type="password"
                name="passwordConfirm"
                value={userInfo.passwordConfirm || ''}
                onChange={handleInputChange}
              />
            </InputGroup>
            <InputGroup>
              <InputName>이메일</InputName>
              <InputText
                style={Input.InputGray}
                type="email"
                name="email"
                value={userInfo.email || ''}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                />{' '}
                남성
                <InputRadio
                  type="radio"
                  name="gender"
                  value="W"
                  checked={userInfo.gender === 'W'}
                  onChange={handleInputChange}
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
                  checked={userInfo.registrationType === 'employee'}
                  onChange={handleInputChange}
                />{' '}
                직원
                <InputRadio
                  type="radio"
                  name="registrationType"
                  value="master"
                  checked={userInfo.registrationType === 'master'}
                  onChange={handleInputChange}
                />{' '}
                기업
                <InputRadio
                  type="radio"
                  name="registrationType"
                  value="worcation"
                  checked={userInfo.registrationType === 'worcation'}
                  onChange={handleInputChange}
                />{' '}
                워케이션 업체
              </RadioGroup>
            </InputGroup>
          </Box>
          {/* 세 번째 박스: 회사 정보 */}
          <Box>
            <InputGroup>
              <InputName>회사명</InputName>
              <InputText
                style={Input.InputGray}
                type="text"
                name="company_name"
                value={userInfo.company_name || ''}
                onChange={handleInputChange}
              />
            </InputGroup>
            <InputGroup>
              <InputName>부서명</InputName>
              <InputText
                style={Input.InputGray}
                type="text"
                name="department"
                value={userInfo.department || ''}
                onChange={handleInputChange}
              />
            </InputGroup>
            <InputGroup>
              <InputName>직급</InputName>
              <InputText
                style={Input.InputGray}
                type="text"
                name="position"
                value={userInfo.position || ''}
                onChange={handleInputChange}
              />
            </InputGroup>
            <InputGroup>
              <InputName>회사주소</InputName>
              <InputText
                style={Input.InputGray}
                type="text"
                name="company_address"
                value={userInfo.company_address || ''}
                onChange={handleInputChange}
              />
            </InputGroup>
            <InputGroup>
              <InputName>회사 이메일</InputName>
              <InputText
                style={Input.InputGray}
                type="email"
                name="company_email"
                value={userInfo.company_email || ''}
                onChange={handleInputChange}
              />
            </InputGroup>
            <InputGroup>
              <InputName>사내 전화번호</InputName>
              <InputText
                style={Input.InputGray}
                type="text"
                name="company_phone"
                value={userInfo.company_phone || ''}
                onChange={handleInputChange}
              />
            </InputGroup>
          </Box>
        </Form>
        <ButnContent>
          <ButnBox>
            <button style={btn.buttonYbShadow}>취소</button>
            <button style={btn.buttonWbShadow} onClick={handleSubmit}>
              완료
            </button>
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

export default Mypage;
