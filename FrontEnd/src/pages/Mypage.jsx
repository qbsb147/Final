import React from 'react';
import styled from 'styled-components';
import Input from '../styles/Input';
import { InputRadio } from '../styles/Input.styles';
import useAuthStore from '../store/authStore';
import api from '../api/axios';
import { useState, useEffect } from 'react';
import btn from '../styles/Button';


const Mypage = () => {
  const { user } = useAuthStore();
  const [userInfo, setUserInfo] = useState(null);

  console.log('Mypage 렌더링됨');
  console.log('스토어 user:', user);

  useEffect(() => {
    if (!user?.userId) {
      console.log('userId 없음. 요청 안함');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        console.log('요청 시작');
        const res = await api.get(`/members?userId=${user.userId}`);
        console.log('요청 성공', res.data);
        setUserInfo(res.data);
      } catch (err) {
        console.error('회원정보 불러오기 실패:', err);
      }
    };

    fetchUserInfo();
  }, [user?.userId]);

  if (!userInfo) return <div>로딩중...</div>;

  return (
    <>
      <Content>
        <TitleBox>
          <Title>마이페이지</Title>
        </TitleBox>
        <Form>
          <Box>
            <InputGroup>
              <InputName>아이디</InputName>
              <InputText style={Input.InputGray} type="text" />
            </InputGroup>
            <InputGroup>
              <InputName>비밀번호</InputName>
              <InputText style={Input.InputGray} type="text" />
            </InputGroup>
            <InputGroup>
              <InputName>비밀번호 확인</InputName>
              <InputText style={Input.InputGray} type="text" />
            </InputGroup>
            <InputGroup>
              <InputName>이메일</InputName>
              <InputText style={Input.InputGray} type="text" />
            </InputGroup>
            <InputGroup>
              <InputName>이름</InputName>
              <InputText style={Input.InputGray} type="text" />
            </InputGroup>
          </Box>
          <Box>
            <InputGroup>
              <InputName>주소</InputName>
              <InputText style={Input.InputGray} type="text" />
            </InputGroup>
            <InputGroup>
              <InputName>나이</InputName>
              <InputText style={Input.InputGray} type="text" />
            </InputGroup>
            <InputGroup>
              <InputName>성별</InputName>
              <RadioGroup>
                <InputRadio type="radio" name="gender" />
                남성
                <InputRadio type="radio" name="gender" />
                여성
              </RadioGroup>
            </InputGroup>
            <InputGroup>
              <InputName>등록</InputName>
              <RadioGroup>
                <InputRadio type="radio" />
                직원
                <InputRadio type="radio" />
                기업
                <InputRadio type="radio" />
                워케이션 업체
              </RadioGroup>
            </InputGroup>
          </Box>
          <Box>
            <InputGroup>
              <InputName>회사명</InputName>
              <InputText style={Input.InputGray} type="text" />
            </InputGroup>
            <InputGroup>
              <InputName>부서명</InputName>
              <InputText style={Input.InputGray} type="text" />
            </InputGroup>
            <InputGroup>
              <InputName>직급</InputName>
              <InputText style={Input.InputGray} type="text" />
            </InputGroup>
            <InputGroup>
              <InputName>회사주소</InputName>
              <InputText style={Input.InputGray} type="text" />
            </InputGroup>
            <InputGroup>
              <InputName>회사 이메일</InputName>
              <InputText style={Input.InputGray} type="text" />
            </InputGroup>
            <InputGroup>
              <InputName>사내 전화번호</InputName>
              <InputText style={Input.InputGray} type="text" />
            </InputGroup>
          </Box>
        </Form>
        <ButnContent>
          <ButnBox>
          <button style={btn.buttonYbShadow}>취소</button>
          <button style={btn.buttonWbShadow}>완료</button>
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
