import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Input from '../styles/Input';
import { InputRadio } from '../styles/Input.styles';
import useAuthStore from '../store/authStore';
import api from '../api/axios';
import btn from '../styles/Button';

const Mypage = () => {
  const { user } = useAuthStore();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!user?.userId) return;
  
    const fetchUserInfo = async () => {
      //백엔드 연결 시 데이터 하나로 합쳐서 가져오는 작업 필요
      try {
        const [memberRes, companyRes, companyProfileRes] = await Promise.all([
          api.get(`/members?userId=${user.userId}`),
          api.get(`/companies?userId=${user.userId}`),
          api.get(`/companyProfiles?userId=${user.userId}`),
        ]);
  
        const memberData = memberRes.data[0];
        const companyData = companyRes.data[0];
        const companyProfileData = companyProfileRes.data[0];
  
        const mappedData = {
          // members에서 가져오는 필드
          id: memberData.id,
          userId: memberData.userId,
          password: memberData.userPwd,
          email: memberData.email,
          name: memberData.name,
          address: memberData.address,
          age: memberData.age,
          gender: memberData.gender === 'men' ? 'M' : 'F',
          registrationType: memberData.type === 'A' ? 'employee' : memberData.type === 'B' ? 'company' : 'worcation',
  
          // companies에서 가져오는 필드
          companyId: companyData?.id,
          companyName: companyData?.companyName || '',
          companyAddress: companyData?.address || '',
          companyEmail: companyData?.email || '',
          companyPhone: companyData?.companyTel || '',

          //companyProfiles에서 가져오는 필드
          companyProfileId: companyProfileData?.id,
          position: companyProfileData?.position || '',
          department: companyProfileData?.department || '',

        };
  
        setUserInfo(mappedData);
      } catch (err) {
        console.error('회원정보 불러오기 실패:', err);
      }
    };
  
    fetchUserInfo();
  }, [user?.userId]);

  if (!userInfo) return <div>로딩중...</div>;

  // 공통 입력 onChange 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {

    // 2. 데이터 분리
    const memberData = {
      userId: userInfo.userId,
      password: userInfo.password,
      email: userInfo.email,
      name: userInfo.name,
      address: userInfo.address,
      age: userInfo.age,
      gender: userInfo.gender,
    };
    const companyData = {
      companyName: userInfo.companyName,
      address: userInfo.companyAddress,
      email: userInfo.companyEmail,
      companyTel: userInfo.companyPhone,
    };
    const companyProfileData = {
      position: userInfo.position,
      department: userInfo.department,
    };

    try {
      // json-server에서는 id(PK)로 접근해야 하므로 userInfo.id, userInfo.companyId, userInfo.companyProfileId 사용
      await api.put(`/members/${userInfo.id}`, memberData);
      await api.put(`/companies/${userInfo.companyId}`, companyData);
      await api.put(`/companyProfiles/${userInfo.companyProfileId}`, companyProfileData);
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
              <InputText style={Input.InputGray} type="text" name="userId" value={userInfo.userId || ''} readOnly />
            </InputGroup>
            <InputGroup>
              <InputName>비밀번호</InputName>
              <InputText style={Input.InputGray} type="password" name="password" value={userInfo.password || ''} onChange={handleInputChange} />
            </InputGroup>
            <InputGroup>
              <InputName>비밀번호 확인</InputName>
              <InputText style={Input.InputGray} type="password" name="passwordConfirm" value={userInfo.passwordConfirm || ''} onChange={handleInputChange} />
            </InputGroup>
            <InputGroup>
              <InputName>이메일</InputName>
              <InputText style={Input.InputGray} type="email" name="email" value={userInfo.email || ''} onChange={handleInputChange} />
            </InputGroup>
            <InputGroup>
              <InputName>이름</InputName>
              <InputText style={Input.InputGray} type="text" name="name" value={userInfo.name || ''} onChange={handleInputChange} />
            </InputGroup>
          </Box>
          {/* 두 번째 박스: 추가 정보 */}
          <Box>
            <InputGroup>
              <InputName>주소</InputName>
              <InputText style={Input.InputGray} type="text" name="address" value={userInfo.address || ''} onChange={handleInputChange} />
            </InputGroup>
            <InputGroup>
              <InputName>나이</InputName>
              <InputText style={Input.InputGray} type="number" name="age" value={userInfo.age || ''} onChange={handleInputChange} />
            </InputGroup>
            <InputGroup>
              <InputName>성별</InputName>
              <RadioGroup>
                <InputRadio type="radio" name="gender" value="M" checked={userInfo.gender === 'M'} onChange={handleInputChange} /> 남성
                <InputRadio type="radio" name="gender" value="F" checked={userInfo.gender === 'F'} onChange={handleInputChange} /> 여성
              </RadioGroup>
            </InputGroup>
            <InputGroup>
              <InputName>등록 유형</InputName>
              <RadioGroup>
                <InputRadio type="radio" name="registrationType" value="employee" checked={userInfo.registrationType === 'employee'} onChange={handleInputChange} /> 직원
                <InputRadio type="radio" name="registrationType" value="company" checked={userInfo.registrationType === 'company'} onChange={handleInputChange} /> 기업
                <InputRadio type="radio" name="registrationType" value="worcation" checked={userInfo.registrationType === 'worcation'} onChange={handleInputChange} /> 워케이션 업체
              </RadioGroup>
            </InputGroup>
          </Box>
          {/* 세 번째 박스: 회사 정보 */}
          <Box>
            <InputGroup>
              <InputName>회사명</InputName>
              <InputText style={Input.InputGray} type="text" name="companyName" value={userInfo.companyName || ''} onChange={handleInputChange} />
            </InputGroup>
            <InputGroup>
              <InputName>부서명</InputName>
              <InputText style={Input.InputGray} type="text" name="department" value={userInfo.department || ''} onChange={handleInputChange} />
            </InputGroup>
            <InputGroup>
              <InputName>직급</InputName>
              <InputText style={Input.InputGray} type="text" name="position" value={userInfo.position || ''} onChange={handleInputChange} />
            </InputGroup>
            <InputGroup>
              <InputName>회사주소</InputName>
              <InputText style={Input.InputGray} type="text" name="companyAddress" value={userInfo.companyAddress || ''} onChange={handleInputChange} />
            </InputGroup>
            <InputGroup>
              <InputName>회사 이메일</InputName>
              <InputText style={Input.InputGray} type="email" name="companyEmail" value={userInfo.companyEmail || ''} onChange={handleInputChange} />
            </InputGroup>
            <InputGroup>
              <InputName>사내 전화번호</InputName>
              <InputText style={Input.InputGray} type="text" name="companyPhone" value={userInfo.companyPhone || ''} onChange={handleInputChange} />
            </InputGroup>
          </Box>
        </Form>
        <ButnContent>
          <ButnBox>
            <button style={btn.buttonYbShadow}>취소</button>
            <button style={btn.buttonWbShadow} onClick={handleSubmit}>완료</button>
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
