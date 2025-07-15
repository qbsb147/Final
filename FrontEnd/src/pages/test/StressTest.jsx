import React, { useState } from 'react'; // useState 임포트 꼭 추가하세요
import styled from 'styled-components';
import { ButtonDetail } from '../../styles/Button.styles';
import { useNavigate } from 'react-router-dom';
import { stress } from '../../components/test/questions';
import { mentalService } from '../../api/mentals';
import { toast } from 'react-toastify';

const StressTest = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});

  const handleChange = (id, value) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const unansweredQuestions = stress.filter(({ id }) => !answers[id]);
    if (unansweredQuestions.length > 0) {
      alert('모든 질문에 답변을 해주세요!');
    } else {
      try {
        await mentalService.postStress(answers);

        navigate('/trial');
      } catch (error) {
        toast.error(error);
      }
    }
  };

  return (
    <Content onSubmit={handleSubmit}>
      <TitleBox>
        <Title>스트레스 자가진단테스트</Title>
      </TitleBox>

      {stress.map(({ id, question, options }) => (
        <TestContent key={id} checked={!!answers[id]}>
          <MainTest>
            <Test>{question}</Test>
          </MainTest>
          <CheckBox>
            {options.map(({ value, label }) => (
              <Label key={value}>
                <Inputs
                  type="radio"
                  name={id}
                  value={value}
                  checked={answers[id] === value}
                  onChange={() => handleChange(id, value)}
                />
                {label}
              </Label>
            ))}
          </CheckBox>
        </TestContent>
      ))}
      <BtnBox>
        <Btn>결과 확인</Btn>
      </BtnBox>
    </Content>
  );
};
const BtnBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Btn = styled(ButtonDetail)`
  font-size: ${({ theme }) => theme.fontSizes.base};
  width: 130px;
  height: 40px;
`;

const Inputs = styled.input`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: #fff;
  width: 18px;
  height: 18px;
  border: 1px solid #d3d3d3;
  border-radius: 0;
  margin-right: 6px;
  cursor: pointer;
  outline: none;
  position: relative;

  &:checked {
    background-color: ${({ theme }) => theme.colors.secondary};
    border-color: ${({ theme }) => theme.colors.black};
  }

  &:checked::after {
    content: '✓';
    color: white;
    font-size: 14px;
    position: absolute;
    top: -2px;
    left: 3px;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  margin-right: 12px;
  cursor: pointer;
  user-select: none;
`;

const CheckBox = styled.div`
  width: 950px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MainTest = styled.div`
  width: 800px;
  display: flex;
  justify-content: left;
  padding-left: ${({ theme }) => theme.spacing.s2};
`;

const Test = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base};
`;

const TestContent = styled.div`
  background: ${({ theme, checked }) => (checked ? theme.colors.primary : theme.colors.white)};
  padding: 10px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
`;

const TitleBox = styled.div`
  padding-left: ${({ theme }) => theme.spacing.s3};
  display: flex;
`;

const Title = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
`;

const Content = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.gray['100']};
  width: 100%;
`;

export default StressTest;
