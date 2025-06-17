import React, { useState } from 'react'; // useState 임포트 꼭 추가하세요
import styled from 'styled-components';
import { ButtonDetail } from '../styles/Button.styles';
import Input from '../styles/Input';

const questions = [
  {
    id: 'stress1',
    question: '예상 밖의 일 때문에 속상한 적은 얼마나 있었나요?',
    options: [
      { value: '1', label: '전혀없었다.' },
      { value: '2', label: '거의없었다.' },
      { value: '3', label: '때때로 있었다.' },
      { value: '4', label: '자주 있었다.' },
      { value: '5', label: '매우 자주 있었다.' },
    ],
  },
  {
    id: 'stress2',
    question: '인생에서 중요한 일을 제어할 수 없다고 느낀 경우는 얼마나 있었나?',
    options: [
      { value: '1', label: '전혀없었다.' },
      { value: '2', label: '거의없었다.' },
      { value: '3', label: '때때로 있었다.' },
      { value: '4', label: '자주 있었다.' },
      { value: '5', label: '매우 자주 있었다.' },
    ],
  },
  {
    id: 'stress3',
    question: '긴장되고 스트레스를 받았다고 느낀 경우는 얼마나 있었나?',
    options: [
      { value: '1', label: '전혀없었다.' },
      { value: '2', label: '거의없었다.' },
      { value: '3', label: '때때로 있었다.' },
      { value: '4', label: '자주 있었다.' },
      { value: '5', label: '매우 자주 있었다.' },
    ],
  },
  {
    id: 'stress4',
    question: '개인적인 문제들을 처리하는 능력에 대해 몇 번이나 확신했는가?',
    options: [
      { value: '1', label: '전혀없었다.' },
      { value: '2', label: '거의없었다.' },
      { value: '3', label: '때때로 있었다.' },
      { value: '4', label: '자주 있었다.' },
      { value: '5', label: '매우 자주 있었다.' },
    ],
  },
  {
    id: 'stress5',
    question: '얼마나 자주 화를 억누를 수 있었나?',
    options: [
      { value: '1', label: '전혀없었다.' },
      { value: '2', label: '거의없었다.' },
      { value: '3', label: '때때로 있었다.' },
      { value: '4', label: '자주 있었다.' },
      { value: '5', label: '매우 자주 있었다.' },
    ],
  },
  {
    id: 'stress6',
    question: '해야 할 일을 감당할 수 없다고 느낀적은 얼마나 있었나?',
    options: [
      { value: '1', label: '전혀없었다.' },
      { value: '2', label: '거의없었다.' },
      { value: '3', label: '때때로 있었다.' },
      { value: '4', label: '자주 있었다.' },
      { value: '5', label: '매우 자주 있었다.' },
    ],
  },
  {
    id: 'stress7',
    question: '기분이 매우 좋다고 느낀 적은 얼마나 있었나?',
    options: [
      { value: '1', label: '전혀없었다.' },
      { value: '2', label: '거의없었다.' },
      { value: '3', label: '때때로 있었다.' },
      { value: '4', label: '자주 있었다.' },
      { value: '5', label: '매우 자주 있었다.' },
    ],
  },
  {
    id: 'stress8',
    question: '일들이 잘 안 풀릴 때 얼마나 자주 화를 냈나?',
    options: [
      { value: '1', label: '전혀없었다.' },
      { value: '2', label: '거의없었다.' },
      { value: '3', label: '때때로 있었다.' },
      { value: '4', label: '자주 있었다.' },
      { value: '5', label: '매우 자주 있었다.' },
    ],
  },
  {
    id: 'stress9',
    question: '어려운 일이 과도하게 누적돼 극복할 수 없다고 생각한 경우는얼마나 있었나?',
    options: [
      { value: '1', label: '전혀없었다.' },
      { value: '2', label: '거의없었다.' },
      { value: '3', label: '때때로 있었다.' },
      { value: '4', label: '자주 있었다.' },
      { value: '5', label: '매우 자주 있었다.' },
    ],
  },
  {
    id: 'stress10',
    question: '일들이 당신의 뜻대로 된다고 느낀 경우는 얼마나 있었나?',
    options: [
      { value: '1', label: '전혀없었다.' },
      { value: '2', label: '거의없었다.' },
      { value: '3', label: '때때로 있었다.' },
      { value: '4', label: '자주 있었다.' },
      { value: '5', label: '매우 자주 있었다.' },
    ],
  },
];

const StressTest = () => {
  const [answers, setAnswers] = useState({}); // 선택 상태 저장

  const handleChange = (id, value) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <Content>
      <TitleBox>
        <Title>스트레스 자가진단테스트</Title>
      </TitleBox>

      {questions.map(({ id, question, options }) => (
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

const TestContent = styled.form`
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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.gray['100']};
  width: 100%;
`;

export default StressTest;
