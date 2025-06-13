import React from 'react';
import styled from 'styled-components';
import Input from '../styles/Input';

const Mypage = () => {
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
                <InputRadio type="radio" />
                남성
                <InputRadio type="radio" />
                여성
              </RadioGroup>
            </InputGroup>
          </Box>
          <Box>
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
      </Content>
    </>
  );
};

const RadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const InputRadio = styled.input`
  -webkit-appearance: none; // 웹킷 브라우저에서 기본 스타일 제거
  -moz-appearance: none; // 모질라 브라우저에서 기본 스타일 제거
  appearance: none; // 기본 브라우저에서 기본 스타일 제거
  background-color: #adadad;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  margin-left: 10px;
  cursor: pointer;

  &:first-of-type {
    margin-left: 0;
  }
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
  gap: 30px;
  padding-top: 20px;
  justify-content: space-between;
`;

const Content = styled.div`
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
