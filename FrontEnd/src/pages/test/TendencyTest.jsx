import React, { useState } from 'react'; // useState 임포트 꼭 추가하세요
import styled from 'styled-components';
import { ButtonDetail } from '../../styles/Button.styles';
import Input from '../../styles/Input';
import { tendency } from './questions';
import useUserStore from '../../store/userStore';
import { Navigate, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import MbtiSelect from '../../components/test/mbtiSelect.jsx';

const TendencyTest = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({}); // 선택 상태 저장
  const { postTendency } = useUserStore.getState();

  const handleChange = (id, value) => {
    setAnswers((prev) => {
      const updated = {
        ...prev,
        [id]: value,
      };
      if (updated.mbti_ei && updated.mbti_ns && updated.mbti_tf && updated.mbti_pj) {
        updated.mbti = (updated.mbti_ei + updated.mbti_ns + updated.mbti_tf + updated.mbti_pj).toLowerCase();
      }
      return updated;
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answers.mbti) {
      alert('MBTI 4가지를 모두 선택해주세요!');
      return;
    }
    const unansweredQuestions = tendency.slice(1).filter(({ id }) => !answers[id]);
    if (unansweredQuestions.length > 0) {
      alert('모든 질문에 답변을 해주세요!');
      return;
    }

    const payload = {
      MBTI: answers.mbti,
      PREFERRED_COLOR: answers['tendency2'],
      PREFERRED_LOCATION: answers['tendency3'],
      SPACE_MOOD: answers['tendency4'],
      IMPORTANT_FACTOR: answers['tendency5'],
      LEISURE_ACTIVITY: answers['tendency6'],
      ACCOMMODATION_TYPE: answers['tendency7'],
    };

    postTendency(payload, navigate);
  };

  return (
    <Content onSubmit={handleSubmit}>
      <TitleBox>
        <Title>성향 분석 테스트</Title>
      </TitleBox>

      {/* MBTI Selects */}
      <TestContent checked={answers.mbti_ei && answers.mbti_ns && answers.mbti_tf && answers.mbti_pj}>
        <MainTest>
          <Test>MBTI를 선택해주세요.</Test>
        </MainTest>
        <MbtiSelect answers={answers} handleChange={handleChange} />
      </TestContent>

      {/* 나머지 문항 (1번 제외) */}
      {tendency.slice(1).map(({ id, question, options }) => (
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
  cursor: pointer;
  outline: none;
  position: relative;

  margin-right: 0; /* 기존 6px 제거 */

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
  gap: 6px;
  cursor: pointer;
  white-space: nowrap;
  justify-content: flex-start; /* 왼쪽 정렬 추가 */
  text-align: left; /* 텍스트 정렬 왼쪽 */
`;

const CheckBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  width: 60%;
`;

const MainTest = styled.div`
  width: 30%;
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
  flex-wrap: nowrap;
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

const Select = styled.select`
  margin: 0 8px;
  padding: 4px 8px;
  font-size: ${({ theme }) => theme.fontSizes.base};
  border-radius: 4px;
  border: 1px solid #d3d3d3;
  background: #fff;
`;

export default TendencyTest;
