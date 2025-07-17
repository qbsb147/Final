import React, { useState } from 'react';
import styled from 'styled-components';
import { ButtonDetail } from '../../styles/Button.styles';
import { worcationService } from '../../api/worcations';
import useAuthStore from '../../store/authStore';
import useWorcationStore from '../../store/useWorcationStore';
import defaultWorcationImage from '../../assets/default-worcation.png';

const WorcationCardList = ({ data, navigate, mode = 'view', onDelete, renderActions, cardStyle }) => {
  const loginUser = useAuthStore((state) => state.loginUser);
  const resetStore = useWorcationStore((state) => state.resetAll);
  const [imageErrors, setImageErrors] = useState({});

  const handleDelete = async (worcation_no) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await worcationService.delete(worcation_no);
        if (onDelete) onDelete();
      } catch (error) {
        console.error('삭제 실패:', error);
      }
    }
  };

  const handleEdit = (worcation) => {
    // 수정 모드로 이동하기 전에 store 초기화
    resetStore();
    // 약간의 지연을 두어 store 초기화가 완료된 후 페이지 이동
    setTimeout(() => {
      navigate(`/worcation/register/${worcation.worcation_no}`);
    }, 100);
  };

  const handleImageError = (worcationNo) => {
    setImageErrors((prev) => ({
      ...prev,
      [worcationNo]: true,
    }));
  };

  const CLOUDFRONT_DOMAIN = import.meta.env.VITE_CLOUDFRONT_DOMAIN;

  const hasFolder = (str) => str && (str.includes('/') || str.startsWith('images/'));
  const getImageSrc = (item) => {
    const worcationNo = item.worcation_no;

    // 이미지 에러가 발생했거나 mainPhoto가 없으면 기본 이미지 URL 반환
    if (imageErrors[worcationNo] || !item.mainPhoto) {
      return defaultWorcationImage;
    }

    // mainPhoto가 http로 시작하지 않으면 CloudFront 도메인만 붙이기
    if (item.mainPhoto.startsWith('http')) {
      return item.mainPhoto;
    }
    return hasFolder(item.mainPhoto)
      ? CLOUDFRONT_DOMAIN + item.mainPhoto
      : CLOUDFRONT_DOMAIN + 'images/' + item.mainPhoto;
  };

  return (
    <CardList>
      {data && data.length > 0 ? (
        data.map((item) => (
          <PlaceCard
            key={item.worcation_no}
            style={cardStyle} // 카드별 스타일 prop 적용
          >
            <picture>
              <PlaceImage
                src={getImageSrc(item)}
                alt={item.worcation_name || '워케이션 이미지'}
                loading="lazy"
                onError={() => handleImageError(item.worcation_no)}
              />
            </picture>
            <CardContent>
              <InfoBlock>
                <PlaceLocation>
                  {item.worcation_address ? item.worcation_address.split(' ').slice(0, 2).join(' ') : ''}
                </PlaceLocation>
                <PlaceName>{item.worcation_name}</PlaceName>
                <PlaceReview>리뷰 ({item.reviews ? item.reviews.length : 0})</PlaceReview>
              </InfoBlock>
              <ThemeBlock>
                <ThemeLabel>테마</ThemeLabel>
                <ThemeText>{item.worcation_thema || '미지정'}</ThemeText>
                {renderActions ? (
                  renderActions(item)
                ) : mode === 'host' && item.member_id === loginUser.user_no ? (
                  <ButtonGroup>
                    <ButtonDetail onClick={() => handleEdit(item)}>수정</ButtonDetail>
                    <ButtonDetail onClick={() => handleDelete(item.worcation_no)}>삭제</ButtonDetail>
                  </ButtonGroup>
                ) : (
                  <ButtonDetail onClick={() => navigate(`/worcation/${item.worcation_no}`)}>상세보기</ButtonDetail>
                )}
              </ThemeBlock>
            </CardContent>
          </PlaceCard>
        ))
      ) : (
        <div>목록이 없습니다.</div>
      )}
    </CardList>
  );
};

export default WorcationCardList;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4%;
`;

const PlaceCard = styled.div`
  display: flex;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 20px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
`;

const PlaceImage = styled.img`
  width: 250px;
  height: 150px;
  min-width: 250px;
  min-height: 150px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  margin: 20px 0 20px 40px;
  background: #f5f5f5;
  display: block;
`;

const CardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 65%;
  padding: 3%;
  gap: 30%;
  flex-wrap: wrap;
`;

const InfoBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 12px;
  align-items: flex-start;
`;

const PlaceLocation = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const PlaceName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: bold;
`;

const PlaceReview = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[800]};
`;

const ThemeBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  border-left: 2px solid ${({ theme }) => theme.colors.yellow};
  padding-left: 5%;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;
