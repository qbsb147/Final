import React, { useState } from 'react';
import Today from '../../components/eat/Today.jsx';
import styled from 'styled-components';
import Card from '../../components/eat/Card.jsx';
import userStore from '../../store/userStore.js';
import { recommended_intake } from '../../components/eat/recommendedIntake.js';
import { MiniContent, MiniTitle } from '../../styles/Typography.js';

const CompleteTest = () => {
  const { eats } = userStore();
  const [gender, setGender] = useState('woman');

  const recommended = recommended_intake[gender];

  return (
    <div>
      <Background>
        <Column1>
          <Today />
          <Circle src="src/assets/food.png" />
          <Inbody>
            <Content>
              <MiniTitle style={{ color: 'white', marginBottom: '6px' }}>
                하루 권장 섭취량({recommended.standard})
              </MiniTitle>
              <MiniContent style={{ color: 'white' }}> ● 열량 : {recommended.calories}</MiniContent>
              <MiniContent style={{ color: 'white' }}> ● 탄수화물 : {recommended.carbohydrates}</MiniContent>
              <MiniContent style={{ color: 'white' }}> ● 단백질 : {recommended.protein}</MiniContent>
              <MiniContent style={{ color: 'white' }}> ● 지방 : {recommended.fat}</MiniContent>
              <MiniContent style={{ color: 'white' }}> ● 나트륨 : {recommended.sodium}</MiniContent>
            </Content>
            <Content>
              <MiniTitle style={{ color: 'yellow', marginBottom: '6px' }}>식사별 권장 비율</MiniTitle>
              <MiniContent style={{ color: 'white' }}> ● 아침 : 30 %</MiniContent>
              <MiniContent style={{ color: 'white' }}> ● 점심 : 40 %</MiniContent>
              <MiniContent style={{ color: 'white' }}> ● 저녁 : 30 %</MiniContent>
            </Content>
          </Inbody>
          <Under>
            <Content>
              <UnderTitle>하루 물 권장 섭취량</UnderTitle>
              <UnderContent> ● 성인 남성 : 약 2.5L</UnderContent>
              <UnderContent> ● 성인 여성 : 약 2.0L</UnderContent>
            </Content>
            <Content>
              <UnderTitle2>식단과 함께하는 건강 루틴</UnderTitle2>
              <UnderContent> ● 식후 30분 걷기</UnderContent>
              <UnderContent> ● 하루 10분 스트레칭</UnderContent>
            </Content>
          </Under>
        </Column1>
        <Column2>
          {eats.map((eat) => (
            <Card key={eat.time} eat={eat} />
          ))}
        </Column2>
      </Background>
    </div>
  );
};

export default CompleteTest;

const UnderContent = styled(MiniContent)`
  font-weight: 500;
`;

const UnderTitle = styled(MiniTitle)`
  color: #1271a8;
  font-weight: 700;
  margin-bottom: 6px;
`;

const UnderTitle2 = styled(MiniTitle)`
  color: #fda029;
  font-weight: 700;
  margin-bottom: 6px;
`;

const Under = styled.div`
  width: 250px;
  background: ${({ theme }) => theme.colors.white};
  height: 280px;
  position: absolute;
  bottom: 0px;
`;

const Content = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  text-align: left;

  span {
    margin-left: 20px;
  }
`;

const Circle = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #517921;
  margin-bottom: -40px;
  background: white;
  z-index: ${({ theme }) => theme.zIndices.docked};
`;

const Background = styled.div`
  background: ${({ theme }) => theme.colors.background};
  width: 1280px;
  height: 800px;
  display: flex;
  gap: 40px;
`;

const Inbody = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius['3xl']} ${({ theme }) => theme.borderRadius['3xl']} 0 0;
  height: 600px;
  width: 250px;
  background: #517921;
`;

const Column1 = styled.div`
  width: 250px;
  height: 730px;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 10px 0px 0px 45px;
  gap: 20px;
  position: relative;
`;
const Column2 = styled.div`
  margin-top: 35px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
