import styled from 'styled-components';
import { ButtonBorder, ButtonDetail } from '../../styles/Button.styles';
import seoul1 from '../../assets/seoul1.jpg';
import siheung1 from '../../assets/siheung1.jpg';
import siheung2 from '../../assets/siheung2.jpg';

const Adata = [
  {
    id: 1,
    location: '서울특별시 영등포구',
    name: '포포인츠 알파이 워케이션',
    reviewCount: 15,
    theme: '모던스타일 / 도심',
    image: seoul1,
  },
  {
    id: 2,
    location: '경기도 시흥시',
    name: '이노테이션 워케이션',
    reviewCount: 16,
    theme: '모던 / 자연 퓨전',
    image: siheung1,
  },
  {
    id: 3,
    location: '경기도 시흥시',
    name: '이노테이션 워케이션',
    reviewCount: 16,
    theme: '모던 / 자연 퓨전',
    image: siheung2,
  },
];

const Bdata = [
  {
    id: 1,
    location: '서울특별시 영등포구',
    name: '포포인츠 알파이 워케이션',
    reviewCount: 15,
    theme: '모던스타일 / 도심',
    image: seoul1,
  },
  {
    id: 2,
    location: '경기도 시흥시',
    name: '이노테이션 워케이션',
    reviewCount: 16,
    theme: '모던 / 자연 퓨전',
    image: siheung1,
  },
  {
    id: 3,
    location: '경기도 시흥시',
    name: '이노테이션 워케이션',
    reviewCount: 16,
    theme: '모던 / 자연 퓨전',
    image: siheung2,
  },
];

const WorcationHistory = () => {
  return (
    <Container>
      <NameBox>
        <SectionTitle>예약</SectionTitle>
      </NameBox>
      <CardList>
        {Adata.map((item) => (
          <PlaceCard key={item.id}>
            <PlaceImage src={item.image} alt={item.name} />
            <CardContent>
              <InfoBlock>
                <PlaceLocation>{item.location}</PlaceLocation>
                <PlaceName>{item.name}</PlaceName>
              </InfoBlock>
              <ThemeBlock tabIndex="0">
                <ThemeLabel>테마</ThemeLabel>
                <ThemeText>{item.theme}</ThemeText>
                <BtnBox>
                  <Btn>상세보기</Btn>
                  <Btn>예약취소</Btn>
                </BtnBox>
              </ThemeBlock>
            </CardContent>
          </PlaceCard>
        ))}
      </CardList>

      <NameBox>
        <SectionTitle>예약 내역</SectionTitle>
        <SmallTitle>(이용후)</SmallTitle>
      </NameBox>

      <CardList>
        {Bdata.map((item) => (
          <BeforePlaceCard key={item.id}>
            <PlaceImage src={item.image} alt={item.name} />
            <CardContent>
              <InfoBlock>
                <PlaceLocation>{item.location}</PlaceLocation>
                <PlaceName>{item.name}</PlaceName>
              </InfoBlock>
              <ThemeBlock tabIndex="0">
                <ThemeLabel>테마</ThemeLabel>
                <ThemeText>{item.theme}</ThemeText>
                <BtnBox>
                  <BeforeBtn>업체상세 보기</BeforeBtn>
                </BtnBox>
              </ThemeBlock>
            </CardContent>
          </BeforePlaceCard>
        ))}
      </CardList>
    </Container>
  );
};
export default WorcationHistory;

const BeforeBtn = styled(ButtonDetail)`
  width: 200px;
  font-size: ${({ theme }) => theme.fontSizes.base};
  background: ${({ theme }) => theme.colors.secondary};
`;

const Btn = styled(ButtonDetail)`
  font-size: ${({ theme }) => theme.fontSizes.base};
  background: ${({ theme }) => theme.colors.secondary};
`;

const BtnBox = styled.div`
  gap: ${({ theme }) => theme.spacing.s2};
  display: flex;
`;

const SmallTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: bold;
`;

const NameBox = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.black};
  display: flex;
  align-items: end;
  padding-bottom: ${({ theme }) => theme.spacing.s2};
`;

const Container = styled.div`
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  padding: 3% 5%;
  text-align: left;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: bold;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin: ${({ theme }) => theme.spacing.s6} 0;
`;

const PlaceCard = styled.div`
  display: flex;
  background: #fff;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const BeforePlaceCard = styled.div`
  display: flex;
  background: #e9e9e9;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const PlaceImage = styled.img`
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  /* margin: 20px 0 20px 40px; */
  margin: 20px;
`;

const CardContent = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding-left: 3%;
  flex-wrap: wrap;
`;

const InfoBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 12px;
`;

const PlaceLocation = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const PlaceName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: bold;
`;

const ThemeBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 35px;
  border-left: 2px solid ${({ theme }) => theme.colors.secondary};
  padding: 5%;
  width: 40%;
`;

const ThemeLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const ThemeText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.black};
`;
