import React, { useState } from 'react'; // useState 임포트 꼭 추가하세요
import styled from 'styled-components';
import { ButtonDetail } from '../styles/Button.styles';
import Input from '../styles/Input';

const questions = [
  {
    id: 'stress1',
    question: '출근하는 생각만 해도 짜증과 함께 가슴이 답답함을 느낀다.',
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
    question: '직장에서 칭찬을 들어도 썩 즐거운 기분이 들지 않는다.',
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
    question: '직장생활 외에 개인적인 생활이나 시간이 거의 없다.',
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
    question: '기력이 없고 쇠약해진 느낌이 든다.',
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
    question: '일하는 것에 심적 부담과 자신의 한계를 느낀다.',
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
    question: '충분한 시간의 잠을 자도 계속 피곤함을 느낀다.',
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
    question: '이전에는 그냥 넘어가던 일에도 화를 참을 수 없다.',
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
    question: '혼자 지내는 시간이 많아졌다.',
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
    question: '현재 업무에 대한 관심이 크게 줄었다.',
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
    question: '주변 사람에게 실망하는 일이 잦다.',
    options: [
      { value: '1', label: '전혀없었다.' },
      { value: '2', label: '거의없었다.' },
      { value: '3', label: '때때로 있었다.' },
      { value: '4', label: '자주 있었다.' },
      { value: '5', label: '매우 자주 있었다.' },
    ],
  },
  {
    id: 'stress11',
    question: '주변에서 고민이 많거나 아파보인다는 말을 자주 듣는다.',
    options: [
      { value: '1', label: '전혀없었다.' },
      { value: '2', label: '거의없었다.' },
      { value: '3', label: '때때로 있었다.' },
      { value: '4', label: '자주 있었다.' },
      { value: '5', label: '매우 자주 있었다.' },
    ],
  },
  {
    id: 'stress12',
    question: '성욕이 감소했다.',
    options: [
      { value: '1', label: '전혀없었다.' },
      { value: '2', label: '거의없었다.' },
      { value: '3', label: '때때로 있었다.' },
      { value: '4', label: '자주 있었다.' },
      { value: '5', label: '매우 자주 있었다.' },
    ],
  },
  {
    id: 'stress13',
    question: '나의 직무 기여도에 대해 스스로 매우 낮다는 생각을 한다.',
    options: [
      { value: '1', label: '전혀없었다.' },
      { value: '2', label: '거의없었다.' },
      { value: '3', label: '때때로 있었다.' },
      { value: '4', label: '자주 있었다.' },
      { value: '5', label: '매우 자주 있었다.' },
    ],
  },
  {
    id: 'stress14',
    question: '만성피로, 감기나 두통, 요통, 소화불량이 늘었다.',
    options: [
      { value: '1', label: '전혀없었다.' },
      { value: '2', label: '거의없었다.' },
      { value: '3', label: '때때로 있었다.' },
      { value: '4', label: '자주 있었다.' },
      { value: '5', label: '매우 자주 있었다.' },
    ],
  },
  {
    id: 'stress15',
    question: '주변 사람과 대화를 나누는 것이 힘들게 느껴진다.',
    options: [
      { value: '1', label: '전혀없었다.' },
      { value: '2', label: '거의없었다.' },
      { value: '3', label: '때때로 있었다.' },
      { value: '4', label: '자주 있었다.' },
      { value: '5', label: '매우 자주 있었다.' },
    ],
  },
];

const BurnoutTest = () => {
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
        <Title>번아웃 자가진단테스트</Title>
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

export default BurnoutTest;
