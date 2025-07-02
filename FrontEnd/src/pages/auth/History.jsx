import styled from 'styled-components';
import { ButtonBorder, ButtonDetail } from '../../styles/Button.styles';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {
  const navigate = useNavigate();
  const [reservedList, setReservedList] = useState([]);
  const [usedList, setUsedList] = useState([]);

  const fetchReservationData = async () => {
    try {
      const res = await axios.get('/api/reservations'); // 백엔드에서 데이터 받아오기
      const all = res.data;

      const reserved = all.filter((item) => item.status === 'RESERVED'); // 예약 중
      const used = all.filter((item) => item.status === 'USED');         // 이용 완료

      setReservedList(reserved);
      setUsedList(used);
    } catch (err) {
      console.error('예약 데이터 불러오기 실패:', err);
    }
  };

  const handleDetail = (id) => {
    navigate(`/worcation/detail/${id}`);
  };

  useEffect(() => {
    fetchReservationData();
  }, []);


const WorcationHistory = () => {
  return (
    <Container>
      <NameBox>
        <SectionTitle>예약</SectionTitle>
      </NameBox>
 <CardList>
        {reservedList.map((item) => (
          <PlaceCard key={item.id}>
            <PlaceImage src={item.thumbnailUrl || '/default.jpg'} alt={item.name} />
            <CardContent>
              <InfoBlock>
                <PlaceLocation>{item.address}</PlaceLocation>
                <PlaceName>{item.name}</PlaceName>
              </InfoBlock>
              <ThemeBlock>
                <ThemeLabel>테마</ThemeLabel>
                <ThemeText>{item.theme}</ThemeText>
                <BtnBox>
                  <Btn onClick={() => handleDetail(item.id)}>상세보기</Btn>
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
        {usedList.map((item) => (
          <BeforePlaceCard key={item.id}>
            <PlaceImage src={item.thumbnailUrl || '/default.jpg'} alt={item.name} />
            <CardContent>
              <InfoBlock>
                <PlaceLocation>{item.address}</PlaceLocation>
                <PlaceName>{item.name}</PlaceName>
              </InfoBlock>
              <ThemeBlock>
                <ThemeLabel>테마</ThemeLabel>
                <ThemeText>{item.theme}</ThemeText>
                <BtnBox>
                  <BeforeBtn onClick={() => handleDetail(item.id)}>업체상세 보기</BeforeBtn>
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
