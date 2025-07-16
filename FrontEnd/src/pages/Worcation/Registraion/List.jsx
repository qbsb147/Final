import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ButtonDetail } from '../../../styles/Button.styles';
import { useParams } from 'react-router-dom';
import useWorcationStore from '../../../store/useWorcationStore';
import { worcationService } from '../../../api/worcations';
import useAuthStore from '../../../store/authStore';
import WorcationCardList from '../../../components/worcation/WorcationCardList';

const WorcationList = () => {
  const loginUser = useAuthStore((state) => state.loginUser);
  const [registeredList, setRegisteredList] = useState([]);
  const [unregisteredList, setUnregisteredList] = useState([]);
  const navigate = useNavigate();
  const { worcation_no } = useParams();
  const resetStore = useWorcationStore((state) => state.resetAll);

  const CLOUDFRONT_DOMAIN = import.meta.env.VITE_CLOUDFRONT_DOMAIN;

  const fetchWorcations = useCallback(async () => {
    try {
      const allList = await worcationService.getMyWorcationList(loginUser.user_no);

      // 각 워케이션에 메인사진 정보 추가
      const processedList = allList.map((worcation) => {
        let sortedPhotos = worcation.photos ? [...worcation.photos] : [];
        sortedPhotos.sort((a, b) => a.photo_no - b.photo_no);

        // 이미지 URL 생성 로직
        let mainPhoto = null;
        if (sortedPhotos.length > 0) {
          const photo = sortedPhotos[0];
          if (photo.image_url && photo.image_url.startsWith('http')) {
            mainPhoto = photo.image_url;
          } else if (photo.image_url) {
            mainPhoto =
              photo.image_url.includes('/') || photo.image_url.startsWith('images/')
                ? CLOUDFRONT_DOMAIN + photo.image_url
                : CLOUDFRONT_DOMAIN + 'images/' + photo.image_url;
          } else if (photo.change_name) {
            mainPhoto =
              photo.change_name.includes('/') || photo.change_name.startsWith('images/')
                ? CLOUDFRONT_DOMAIN + photo.change_name
                : CLOUDFRONT_DOMAIN + 'images/' + photo.change_name;
          }
        }

        return {
          ...worcation,
          mainPhoto,
        };
      });

      setRegisteredList(processedList.filter((w) => w.status === 'Y'));
      setUnregisteredList(processedList.filter((w) => w.status === 'N'));
    } catch (error) {
      console.error('목록 불러오기 실패:', error);
    }
  }, [loginUser?.user_no]);

  useEffect(() => {
    if (!loginUser?.user_no) return;
    fetchWorcations();
  }, [loginUser?.user_no, fetchWorcations]);

  useEffect(() => {
    const fetchWorcationDetail = async () => {
      try {
        const data = await worcationService.getDetail(worcation_no);

        // 스토어에 데이터를 올바른 구조로 설정
        useWorcationStore.getState().setAllData({
          application: {
            worcation_name: data.worcation_name || '',
            business_id: data.business_id || '',
            licensee: data.licensee || '',
            open_date: data.open_date || null,
            companyType: data.worcation_category || 'Office',
            partner_price: data.partner_price || '',
            charge_amount: data.charge_amount || '',
            status: data.status || 'N',
          },
          info: {
            theme: data.worcation_thema || '',
            maxPeople: data.max_people || '',
            price: data.non_partner_price || '',
            tel: data.worcation_tel || '',
            policy: data.policy || '',
          },
          description: {
            detailIntro: data.content || '',
          },
          location: {
            address: data.worcation_address || '',
            locationDescription: data.navigate || '',
          },
          policy: {
            availableTime: data.available_time || '',
            refundPolicy: data.refund_policy || '',
            checkinPeriod: 'AM',
            checkinHour: '9',
            checkinMinute: '00',
            checkoutPeriod: 'AM',
            checkoutHour: '11',
            checkoutMinute: '00',
            officeStartPeriod: 'AM',
            officeStartHour: '9',
            officeStartMinute: '00',
            officeEndPeriod: 'PM',
            officeEndHour: '6',
            officeEndMinute: '00',
          },
          feature: {
            locationType: data.location_type || '',
            dominantColor: data.dominant_color || '',
            spaceMood: data.space_mood || '',
            bestFor: data.best_for || '',
            activities: data.activities ? data.activities.split(',') : [],
            accommodationType: data.accommodation_type || '',
          },
          amenities: data.amenities || [],
          photos: {
            officePhotos: data.photo_urls || [],
            stayPhotos: [],
          },
        });
      } catch (error) {
        console.error('워케이션 상세 조회 실패:', error);
      }
    };

    if (worcation_no) {
      fetchWorcationDetail();
    }
  }, [worcation_no]);

  const handleAddClick = () => {
    // 새로운 등록을 위해 store 초기화
    resetStore();
    navigate('/worcation/register');
  };

  return (
    <Container>
      <NameBox>
        <SectionTitle>워케이션 등록 목록</SectionTitle>
        <Btn onClick={handleAddClick}>+추가</Btn>
      </NameBox>
      <WorcationCardList data={registeredList} navigate={navigate} mode="host" onDelete={fetchWorcations} />

      <NameBox>
        <SectionTitle>미등록 목록</SectionTitle>
      </NameBox>
      <WorcationCardList data={unregisteredList} navigate={navigate} mode="host" />
    </Container>
  );
};
export default WorcationList;

const Btn = styled(ButtonDetail)`
  font-size: ${({ theme }) => theme.fontSizes.base};
  background: ${({ theme }) => theme.colors.secondary};
`;

const NameBox = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.black};
  display: flex;
  align-items: end;
  padding-bottom: ${({ theme }) => theme.spacing.s2};
  justify-content: space-between;
  margin-bottom: 20px;
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
