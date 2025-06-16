import React from 'react';
import styled from 'styled-components';
import { FaUser } from 'react-icons/fa';
import Button from '../../styles/Button';
import InputStyle from '../../styles/Input';

const PartnershipForm = () => {
  return (
    <FormContainer>
      <FormWrapper>
        <Column>
          <FormGroup>
            <Label>기업 이름</Label>
            <InputWrapper>
              <FaUser className="icon" />
              <Input placeholder="기업 이름" style={InputStyle.InputGray} />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>사업자명</Label>
            <InputWrapper>
              <FaUser className="icon" />
              <Input placeholder="사업자명" style={InputStyle.InputGray} />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>연락처</Label>
            <InputWrapper>
              <FaUser className="icon" />
              <Input placeholder="연락처" style={InputStyle.InputGray} />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>희망 날짜</Label>
            <DateRangeWrapper>
              <InputDate type="date" style={InputStyle.InputYellow} />
              <DateSeparator>~</DateSeparator>
              <InputDate type="date" style={InputStyle.InputYellow} />
            </DateRangeWrapper>
          </FormGroup>
        </Column>

        <Column>
          <FormGroup>
            <Label>기업 인원</Label>
            <InputWrapper>
              <FaUser className="icon" />
              <Input placeholder="제휴 인원" style={InputStyle.InputGray} />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>사업자번호</Label>
            <InputWrapper>
              <FaUser className="icon" />
              <Input placeholder="사업자번호" style={InputStyle.InputGray} />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>이메일</Label>
            <InputWrapper>
              <FaUser className="icon" />
              <Input placeholder="이메일" style={InputStyle.InputGray} />
            </InputWrapper>
          </FormGroup>
        </Column>
      </FormWrapper>

      <ButtonGroup>
        <ButtonYellow style={Button.buttonYb}>이전</ButtonYellow>
        <ButtonWhite style={Button.buttonWhite}>제출</ButtonWhite>
      </ButtonGroup>
    </FormContainer>
  );
};

export default PartnershipForm;

const FormContainer = styled.div`
  width: 100%;
  height: auto;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: 20px;
  padding: 80px;
  box-sizing: border-box;
`;

const FormWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 120px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  flex: 1;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.fontFamily.primary};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: #000;
`;

const InputWrapper = styled.div`
  position: relative;

  .icon {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: #dddddd;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding-left: 40px;
  font-family: ${({ theme }) => theme.fontFamily.secondary};
  font-size: 16px;
`;

const InputDate = styled.input`
  width: 45%;
  height: 48px;
  padding: 0 10px;
`;

const DateRangeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DateSeparator = styled.span`
  font-size: 20px;
  margin: 0 5px;
  color: #000;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 60px;
`;

const ButtonYellow = styled.button`
  width: 100px;
  height: 50px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
`;

const ButtonWhite = styled.button`
  width: 100px;
  height: 50px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
`;
