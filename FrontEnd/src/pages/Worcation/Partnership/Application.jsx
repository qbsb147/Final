import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaUser } from 'react-icons/fa';
import Button from '../../../styles/Button';
import InputStyle from '../../../styles/Input';
import { useNavigate, useLocation } from 'react-router-dom';
import { partnerService } from '../../../api/partner';
import useAuthStore from '../../../store/authStore';
import useSelectedWorcationStore from '../../../store/selectedWorcationStore';
const Application = () => {
  const { loginUser } = useAuthStore();
  const navigate = useNavigate();
  // 간단한 방법: zustand store에서 선택된 워케이션 가져오기
  const selectedWorcation = useSelectedWorcationStore((s) => s.selectedWorcation);
  const worcationNo = selectedWorcation?.worcation_no;
  // const worcationNo = selectedWorcation?.worcation_no || localStorage.getItem('selectedWorcationNo'); // 임시 방법(주석)

  const setSelectedWorcation = useSelectedWorcationStore((state) => state.setSelectedWorcation);


  useEffect(() => {
    if (!loginUser?.user_id) return;

    if (loginUser.role !== 'MASTER' && loginUser.role !== 'MANAGER') {
      navigate('/error');
      return;
    }
  }, [loginUser, navigate]);

  useEffect(() => {
    if (loginUser) {
      console.log('loginUser =', loginUser); // 디버깅용
      setFormData((prev) => ({
        ...prev,
        company_name: loginUser.company_name || '',
        licensee: loginUser.licensee || '',
        company_tel: loginUser.company_tel || '',
        business_id: loginUser.business_id || '',
        company_email: loginUser.company_email || '',
      }));
    }
  }, [loginUser]);

  // 인원, 연락처, 이메일은 직접 입력, memberNo/companyNo는 유저에서 자동
  const [formData, setFormData] = useState({
    company_name: '',
    licensee: '',
    company_tel: '', // 연락처(직접 입력)
    start_date: '',
    end_date: '',
    company_people: '', // 인원(직접 입력)
    business_id: '',
    company_email: '', // 이메일(직접 입력)
    member_no: loginUser?.user_no || '',
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      console.log('loginUser (제출시점) =', loginUser); // 디버깅용
      const submitData = {
        ...formData,
        company_people: Number(formData.company_people),
        member_no: Number(loginUser?.user_no) || '',
        company_no: Number(loginUser?.company_no) || '',
        // worcationNo: '1',
        worcation_no: Number(worcationNo), // store에서 가져온 번호 사용
      };

      await partnerService.create(submitData);
      alert('제휴 신청이 완료되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('제휴 신청 실패:', error);
      alert('제출 중 오류가 발생했습니다.');
    }
  };

  return (
    <FormContainer>
      <FormWrapper>
        <Column>
          <FormGroup>
            <Label>기업 이름</Label>
            <InputWrapper>
              <Input
                placeholder="기업 이름"
                style={InputStyle.InputGray}
                value={formData.company_name}
                onChange={handleChange('company_name')}
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>사업자명</Label>
            <InputWrapper>
              <Input
                placeholder="사업자명"
                style={InputStyle.InputGray}
                value={formData.licensee}
                onChange={handleChange('licensee')}
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>연락처</Label>
            <InputWrapper>
              <Input
                placeholder="연락처"
                style={InputStyle.InputGray}
                value={formData.company_tel}
                onChange={handleChange('company_tel')}
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>희망 날짜</Label>
            <DateRangeWrapper>
              <InputDate
                type="date"
                style={InputStyle.InputYellow}
                value={formData.start_date}
                onChange={handleChange('start_date')}
              />
              <DateSeparator>~</DateSeparator>
              <InputDate
                type="date"
                style={InputStyle.InputYellow}
                value={formData.end_date}
                onChange={handleChange('end_date')}
              />
            </DateRangeWrapper>
          </FormGroup>
        </Column>

        <Column>
          <FormGroup>
            <Label>기업 인원</Label>
            <InputWrapper>
              <Input
                placeholder="제휴 인원"
                style={InputStyle.InputGray}
                value={formData.company_people}
                onChange={handleChange('company_people')}
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>사업자번호</Label>
            <InputWrapper>
              <Input
                placeholder="사업자번호"
                style={InputStyle.InputGray}
                value={formData.business_id}
                onChange={handleChange('business_id')}
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>이메일</Label>
            <InputWrapper>
              <Input
                placeholder="이메일"
                style={InputStyle.InputGray}
                value={formData.company_email}
                onChange={handleChange('company_email')}
              />
            </InputWrapper>
          </FormGroup>
        </Column>
      </FormWrapper>

      <ButtonGroup>
        <ButtonYellow style={Button.buttonYb}>이전</ButtonYellow>
        <ButtonWhite style={Button.buttonWhite} onClick={handleSubmit}>
          제출
        </ButtonWhite>
      </ButtonGroup>
    </FormContainer>
  );
};

export default Application;

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
  gap: 5px;
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
