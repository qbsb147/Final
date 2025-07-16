import React, { useEffect } from 'react';
import Today from '../../components/eat/Today.jsx';
import styled from 'styled-components';
import Card from '../../components/eat/Card.jsx';
import userStore from '../../store/userStore.js';
import { recommended_intake } from '../../components/eat/recommendedIntake.js';
import { MiniContent, MiniTitle } from '../../styles/Typography.js';
import useAuthStore from '../../store/authStore.js';
import memberService from '../../api/members';
import { format } from 'date-fns';

const CompleteTest = () => {
  const { eats, setEats, eatsDate } = userStore();
  const { loginUser } = useAuthStore();
  const gender = loginUser.gender;
  const recommended = recommended_intake[gender];
  const [loading, setLoading] = React.useState(false);

  const [called, setCalled] = React.useState(false);
  console.log(eats, setEats, eatsDate);

  useEffect(() => {
    if (!loginUser?.user_no) return;

    const todayStr = format(new Date(), 'yyyy-MM-dd');

    // 콘솔 출력으로 상태 확인
    console.log('Current eatsDate:', eatsDate, 'Today:', todayStr);
    console.log('Current eats length:', eats.length);

    if (called) {
      console.log('이미 호출 완료됨. fetch 중단');
      return;
    }

    // 오늘 날짜와 저장된 eatsDate가 같고, eats가 있으면 fetch 안 함
    if (eatsDate === todayStr && eats.length > 0) {
      console.log('오늘 데이터 이미 있음. fetch 중단');
      setCalled(true); // ✅ 최초 렌더링 시 바로 끝내기
      return;
    }

    async function fetchDiet() {
      setLoading(true);
      try {
        const data = await memberService.getDietRecommendation(loginUser.user_no);
        const eatsFromServer =
          data?.dietImageResults?.map((item, index) => ({
            time: index + 1,
            title: `${item.meal} 식단 추천`,
            image: item.imageUrl,
            menu: item.menu,
            explain: item.reason,
          })) || [];

        const todayStr = format(new Date(), 'yyyy-MM-dd');
        console.log('fetchDiet setEats 호출 전:', eatsFromServer, todayStr);
        setEats(eatsFromServer, todayStr);
        setCalled(true); // ✅ 여기서 확정적으로 호출 완료 처리
      } catch (error) {
        console.error('식단 추천 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDiet();
  }, [loginUser.user_no, eatsDate, eats.length, called]);

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
          {loading ? (
            <Card loading={true} />
          ) : eats.length > 0 ? (
            eats.map((eat) => <Card key={eat.time} eat={eat} loading={false} />)
          ) : (
            <p>추천 식단이 없습니다.</p>
          )}
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
