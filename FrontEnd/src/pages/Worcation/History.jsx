import styled from 'styled-components';
import { ButtonDetail } from '../../styles/Button.styles';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAuthStore from '../../store/authStore';
import { applicationService } from '../../api/application';
import { worcationService } from '../../api/worcations';
import WorcationCardList from '../../components/worcation/WorcationCardList';

const WorcationHistory = () => {
  const navigate = useNavigate();
  const [reservedList, setReservedList] = useState([]);
  const [usedList, setUsedList] = useState([]);
  const { loginUser } = useAuthStore();

  useEffect(() => {
    if (!loginUser?.user_no) return;
    getReservedWorcation();
  }, [loginUser?.user_no]);

  const getReservedWorcation = async () => {
    try {
      const reserved = await applicationService.reserved(loginUser.user_no);

      const used = await applicationService.used(loginUser.user_no);
      setReservedList(reserved);
      setUsedList(used);
    } catch (err) {
      console.log('예약 데이터 조회 실패:', err);
    }
  };

  const handleDetail = async (worcationNo) => {
    try {
      const data = await worcationService.getDetail(worcationNo);
      navigate(`/worcation/detail/${worcationNo}`, { state: data });
    } catch (e) {
      console.log(e);
    }
  };
  const handleDelete = async (application_no) => {
    try {
      const confirm = await Swal.fire({
        title: '삭제하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
      });
      if (confirm.isConfirmed) {
        await applicationService.delete(application_no);
        Swal.fire('삭제 완료', '예약이 삭제되었습니다.', 'success');
        // 삭제 후 목록 다시 불러오기
        getReservedWorcation(); // 예약 목록 재조회 함수
      }
    } catch (error) {
      Swal.fire('삭제 실패', '예약 삭제 중 문제가 발생했습니다.', 'error');
      console.error(error);
    }
  };

  // WorcationCardList에 맞는 데이터 변환(mainPhoto 필드 추가)
  const convertToCardData = (list) =>
    list.map((item) => ({
      ...item,
      mainPhoto: item.main_change_photo, // 이미지 필드명 맞추기
      worcation_address: item.worcation_address || '',
      reviews: item.reviews || [],
    }));

  // 예약 카드의 버튼 렌더링 (상세/예약취소)
  const renderReservedActions = (item) => (
    <BtnBox>
      <Btn onClick={() => navigate(`/worcation/${item.worcation_no}`)}>상세보기</Btn>
      <Btn
        onClick={() => {
          console.log('삭제 시도 항목:', item);
          handleDelete(item.application_no);
        }}
      >
        예약취소
      </Btn>
    </BtnBox>
  );

  // 이용후 카드의 버튼 렌더링 (상세만)
  const renderUsedActions = (item) => (
    <BtnBox>
      <Btn onClick={() => navigate(`/worcation/${item.worcation_no}`)}>상세보기</Btn>
    </BtnBox>
  );

  return (
    <Container>
      <NameBox>
        <SectionTitle>예약</SectionTitle>
      </NameBox>
      {/* 기존 카드 리스트 주석처리 */}
      {/*
      <CardList>
        {reservedList.map((item) => (
          <PlaceCard key={item.worcation_no}>
            <PlaceImage src={item.main_change_photo} alt={item.worcation_name} />
            <CardContent>
              <InfoBlock>
                <PlaceName>{item.worcation_name}</PlaceName>
                <DateText>
                  기간: {item.start_date?.join('-')} ~ {item.end_date?.join('-')}
                </DateText>
              </InfoBlock>
              <ThemeBlock tabIndex="0">
                <BtnBox>
                  <Btn onClick={() => navigate(`/worcation/${item.worcation_no}`)}>상세보기</Btn>
                  <Btn
                    onClick={() => {
                      console.log('삭제 시도 항목:', item);
                      handleDelete(item.application_no);
                    }}
                  >
                    예약취소
                  </Btn>
                </BtnBox>
              </ThemeBlock>
            </CardContent>
          </PlaceCard>
        ))}
      </CardList>
      */}
      {convertToCardData(reservedList).length > 0 ? (
        <WorcationCardList
          data={convertToCardData(reservedList)}
          navigate={navigate}
          mode="view"
          renderActions={renderReservedActions}
        />
      ) : (
        <div style={{ margin: '40px 0', textAlign: 'center', color: '#888', fontSize: '1.2rem' }}>
          예약 내역이 없습니다.
        </div>
      )}

      <NameBox>
        <SectionTitle>예약 내역</SectionTitle>
        <SmallTitle>(이용후)</SmallTitle>
      </NameBox>
      {/*
      <CardList>
        {usedList.map((item) => (
          <BeforePlaceCard key={item.worcation_no}>
            <PlaceImage src={item.main_change_photo} alt={item.worcation_name} />
            <CardContent>
              <InfoBlock>
                <PlaceName>{item.worcation_name}</PlaceName>
              </InfoBlock>
              <ThemeBlock tabIndex="0">
                <BtnBox>
                  <Btn onClick={() => navigate(`/worcation/${item.worcation_no}`)}>상세보기</Btn>
                </BtnBox>
              </ThemeBlock>
            </CardContent>
          </BeforePlaceCard>
        ))}
      </CardList>
      */}
      {convertToCardData(usedList).length > 0 ? (
        <WorcationCardList
          data={convertToCardData(usedList)}
          navigate={navigate}
          cardStyle={{ background: '#e9e9e9' }}
          mode="view"
          renderActions={renderUsedActions}
        />
      ) : (
        <div style={{ margin: '40px 0', textAlign: 'center', color: '#888', fontSize: '1.2rem' }}>
          이용후 내역이 없습니다.
        </div>
      )}
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

const DateText = styled.p`
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
