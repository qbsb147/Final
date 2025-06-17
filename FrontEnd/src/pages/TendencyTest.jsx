import React, { useState } from 'react'; // useState 임포트 꼭 추가하세요
import styled from 'styled-components';
import { ButtonDetail } from '../styles/Button.styles';
import Input from '../styles/Input';

const questions = [
  {
    id: 'stress1',
    question: 'MBTI가 무엇입니까?',
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
    question: '선호하는 지역은 어디인가요?',
    options: [
      { value: '1', label: '산' },
      { value: '2', label: '강' },
      { value: '3', label: '바다' },
      { value: '4', label: '평야' },
      { value: '5', label: '도시' },
    ],
  },
  {
    id: 'stress3',
    question: '가장 끌리는 새상 계열은 무엇인가요?',
    options: [
      { value: '1', label: '녹색, 브라운' },
      { value: '2', label: '파란색, 하늘색' },
      { value: '3', label: '노란색, 주황색' },
      { value: '4', label: '무채색' },
      { value: '5', label: '보라색' },
    ],
  },
  {
    id: 'stress4',
    question: '좋아하는 공간 분위기는 무엇인가요?',
    options: [
      { value: '1', label: '모던' },
      { value: '2', label: '캠핑' },
      { value: '3', label: '자연친화' },
      { value: '4', label: '도시 + 자연' },
      { value: '5', label: '조용한 공간' },
    ],
  },
  {
    id: 'stress5',
    question: '워케이션에서 가장 중요한 것은 무엇입니까?',
    options: [
      { value: '1', label: '업무 효율' },
      { value: '2', label: '자연 경치' },
      { value: '3', label: '액티비티' },
      { value: '4', label: '휴식 공간' },
      { value: '5', label: '전체 분위기' },
    ],
  },
  {
    id: 'stress6',
    question: '워케이션 중 선호하는 활동은 어떤건가요?',
    options: [
      { value: '1', label: '독서나 산책' },
      { value: '2', label: '수영이나 해양 스포츠' },
      { value: '3', label: '지역 탐방 및 맛집' },
      { value: '4', label: '명상, 요가, 휴식' },
      { value: '5', label: '다른 사람들과의 교류 활동' },
    ],
  },
  {
    id: 'stress7',
    question: '어떤 숙소 유형을 가장 선호하나요?',
    options: [
      { value: '1', label: '깔끔하고 편리한곳' },
      { value: '2', label: '감성적인 감성 숙소' },
      { value: '3', label: '자연속 숙소' },
      { value: '4', label: '공유 공간 있는 숙소' },
      { value: '5', label: '캠핑/차박' },
    ],
  },
];

const TendencyTest = () => {
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
        <Title>성향 분석 테스트</Title>
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

const TestContent = styled.form`
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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.gray['100']};
  width: 100%;
`;

export default TendencyTest;
