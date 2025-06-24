import React from 'react';
import styled from 'styled-components';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';
import { ButtonYbShadow, ButtonWhite } from './Button.styles';
import InputStyle from './Input.styles';

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

          <FormGroup>
            <Label>희망 날짜</Label>
            <DateRangeWrapper>
              <FaCalendarAlt className="calendar-icon" />
              <DateInput type="month" style={InputStyle.InputYellow} />
              <Tilde>~</Tilde>
              <DateInput type="month" style={InputStyle.InputYellow} />
            </DateRangeWrapper>
          </FormGroup>
        </Column>
      </FormWrapper>

      <ButtonGroup>
        <ButtonYbShadow>이전</ButtonYbShadow>
        <ButtonWhite>제출</ButtonWhite>
      </ButtonGroup>
    </FormContainer>
  );
};

export default PartnershipForm;

const FormContainer = styled.div`
  width: 1048px;
  height: auto;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing.s12};
  box-sizing: border-box;
`;

const FormWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.s10};
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s6};
  flex: 1;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s2};
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.fontFamily.primary};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.black};
`;

const InputWrapper = styled.div`
  position: relative;

  .icon {
    position: absolute;
    top: 50%;
    left: ${({ theme }) => theme.spacing.s2};
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.gray[300]};
  }
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding-left: ${({ theme }) => theme.spacing.s8};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-family: ${({ theme }) => theme.fontFamily.secondary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.black};
`;

const DateRangeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s4};

  .calendar-icon {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
    color: ${({ theme }) => theme.colors.black};
  }
`;

const DateInput = styled.input`
  width: 160px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-family: ${({ theme }) => theme.fontFamily.secondary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-align: center;
`;

const Tilde = styled.span`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.black};
  display: inline-block;
  margin-top: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.s6};
  margin-top: ${({ theme }) => theme.spacing.s10};
`;

export const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;
