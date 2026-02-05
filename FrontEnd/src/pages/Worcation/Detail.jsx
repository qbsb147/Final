import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ButtonBorder } from '../../styles/Button.styles.js';
import { useNavigate, useParams } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { worcationService } from '../../api/worcations.js';
import { chatService } from '../../api/chat.js';
import useAuthStore from '../../store/authStore.js';
import useSelectedWorcationStore from '../../store/selectedWorcationStore.js';
import ImageSlider from '../../components/image/ImageSlider.jsx';
import WorcationInfo from './components/detail/WorcationInfo';
import ReviewSection from './components/detail/ReviewSection.jsx';

const CLOUDFRONT_DOMAIN = import.meta.env.VITE_CLOUDFRONT_DOMAIN;

const WorcationDetail = () => {
  const loginUser = useAuthStore((state) => state.loginUser);
  const navigate = useNavigate();
  const { worcationNo } = useParams();
  const [worcation, setWorcation] = useState(null);
  const [detail, setDetail] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [features, setFeatures] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [photos, setPhotos] = useState([]);
  const [editedContent, setEditedContent] = useState('');
  const [appData, setAppData] = useState(null);
  const setSelectedWorcation = useSelectedWorcationStore((state) => state.setSelectedWorcation);

  useEffect(() => {
    // worcationNo로 데이터 가져오기
    const fetchData = async () => {
      if (worcationNo) {
        try {
          // 워케이션 상세 정보 (모든 정보 포함)
          const data = await worcationService.getDetail(worcationNo);
          setWorcation(data);
          // detail 정보는 worcation 객체에 포함되어 있음
          setDetail(data);
          // features 정보도 포함되어 있음
          setFeatures([data]);
          // amenities 정보도 포함되어 있음 (partners에서 추출)
          if (data.partners) {
            setAmenities(data.partners);
          }
          // photos 정보 설정
          if (data.photos) {
            setPhotos(data.photos);
          }
          // 리뷰 정보도 포함되어 있음
          if (data.reviews) {
            setReviews(data.reviews);
          }
          setAmenities(data.amenities);
        } catch (error) {
          console.error('워케이션 정보 가져오기 실패:', error);
        }
      }
    };
    fetchData();
  }, [worcationNo]);

  useEffect(() => {
    const addFetchData = async () => {
      const appData = await worcationService.applicationList();
      setAppData(appData);
    };
    addFetchData();
  }, []);

  useEffect(() => {
    if (loginUser !== null) {
      const review = reviews.find((r) => r.review_no === loginUser);
      setEditedContent(review ? review.review_content : '');
    }
  }, [loginUser, reviews]);
  console.log(loginUser?.user_id);
  console.log(worcation);
  if (!worcation) return null;
  const [officeTime, accomTime] = worcation?.available_time?.split('/') || ['', ''];
  const sortedPhotos = [...(photos || [])].sort((a, b) => a.photo_no - b.photo_no);
  const hasFolder = (str) => str && (str.includes('/') || str.startsWith('images/'));
  const images = [
    worcation.main_change_photo
      ? worcation.main_change_photo.startsWith('http')
        ? worcation.main_change_photo
        : hasFolder(worcation.main_change_photo)
          ? CLOUDFRONT_DOMAIN + worcation.main_change_photo
          : CLOUDFRONT_DOMAIN + 'images/' + worcation.main_change_photo
      : null,
    ...sortedPhotos.map((p) =>
      p.image_url
        ? p.image_url.startsWith('http')
          ? p.image_url
          : hasFolder(p.image_url)
            ? CLOUDFRONT_DOMAIN + p.image_url
            : CLOUDFRONT_DOMAIN + 'images/' + p.image_url
        : p.change_name
          ? p.change_name.startsWith('http')
            ? p.change_name
            : hasFolder(p.change_name)
              ? CLOUDFRONT_DOMAIN + p.change_name
              : CLOUDFRONT_DOMAIN + 'images/' + p.change_name
          : null
    ),
  ].filter(Boolean);

  //댓글
  //테스트 시 신청 먼저 해야함
  const loginUserId = 'user001';

  const handleAddComment = async () => {
    const review = {
      application_no: 1,
      writer_id: loginUserId,
      review_content: newComment,
      create_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
    };
    try {
      const data = await worcationService.addReview(review);
      alert('댓글이 등록되었습니다.');
      setNewComment('');
      setReviews((prev) => [...prev, data]);
      return data;
    } catch {
      alert('댓글 등록에 실패했습니다.');
    }
  };

  const handleSaveEdit = async (review_no) => {
    try {
      await worcationService.updateReview(review_no, {
        review_content: editedContent,
        update_at: new Date().toISOString(),
      });
      alert('댓글을 수정하였습니다.');

      setEditedContent('');

      setReviews((prev) =>
        prev.map((r) =>
          r.review_no === review_no ? { ...r, review_content: editedContent, update_at: new Date().toISOString() } : r
        )
      );
    } catch {
      alert('댓글 수정에 실패하였습니다.');
    }
  };

  const handleDelete = async (review_no) => {
    try {
      await worcationService.deleteReview(review_no);
      setReviews((prev) => prev.filter((r) => r.review_no !== review_no));
      alert('댓글이 삭제되었습니다.');
    } catch {
      alert('댓글 삭제에 실패하였습니다.');
    }
  };
  // 댓글 막기
  const today = new Date();
  const endDate = appData ? new Date(appData.end_date) : null;
  const isDisabled = !(appData && appData.approve === 'Y' && endDate > today);

  const handleAddWorcationChat = async (worcationNo) => {
    try {
      await chatService.addWorcationChat(worcationNo);
    } catch {
      alert('1:1 문의 등록에 실패했습니다.');
    }
  };

  return (
    <PageContainer>
      <Wrapper>
        <MainImageWrapper>
          {loginUser && (
            <TopButtons>
              {loginUser.role !== 'EMPLOYEE' && loginUser.role !== 'WORCATION' && (
                <ButtonBorder
                  onClick={() => {
                    setSelectedWorcation(worcation);
                    navigate('/partnership/apply');
                  }}
                >
                  제휴 신청
                </ButtonBorder>
              )}
              {loginUser.role !== 'WORCATION' && (
                <>
                  <ButtonBorder onClick={() => navigate('/worcation/apply', { state: { worcation } })}>
                    예약
                  </ButtonBorder>
                  <ButtonBorder
                    onClick={async () => {
                      await handleAddWorcationChat(worcation.worcation_no);
                      navigate('/my/chat');
                    }}
                  >
                    1:1 문의
                  </ButtonBorder>
                </>
              )}
            </TopButtons>
          )}
        </MainImageWrapper>
        <Title>{worcation.worcation_name}</Title>
        <ImageSlider images={images} />
        <PriceWrapper>
          <Price>{worcation.non_partner_price?.toLocaleString()} 원</Price>
        </PriceWrapper>
        <WorcationInfo
          worcation={worcation}
          officeTime={officeTime}
          accomTime={accomTime}
          detail={detail}
          features={features}
          amenities={amenities}
        />
      </Wrapper>

      <CommentTitle>댓글 ({reviews ? reviews.length : 0})</CommentTitle>
      <Wrapper2>
        <ReviewSection
          reviews={reviews}
          loginUser={loginUser}
          isDisabled={isDisabled}
          handleAddComment={handleAddComment}
          handleSaveEdit={handleSaveEdit}
          handleDelete={handleDelete}
        />
      </Wrapper2>
    </PageContainer>
  );
};

export default WorcationDetail;

const PageContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};
`;

const Wrapper = styled.div`
  width: auto;
  margin: 50px auto;
  background: rgba(196, 196, 196, 0.1);
  border-top: 2px solid ${({ theme }) => theme.colors.brown};
  border-bottom: 2px solid ${({ theme }) => theme.colors.brown};
  padding: 60px;
  box-sizing: border-box;
`;

const Wrapper2 = styled(Wrapper)`
  margin-top: 30px;
`;

const MainImageWrapper = styled.div`
  margin-bottom: 40px;
  position: relative;
`;

const TopButtons = styled.div`
  position: absolute;
  right: 20px;
  display: flex;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-family: 'Godo B';
  color: ${({ theme }) => theme.colors.black};
  margin-top: 80px;
  margin-bottom: 30px;
  text-align: left;
  margin-left: 30px;
`;

const PriceWrapper = styled.div`
  text-align: right;
  margin: 10px 0 40px;
`;

const Price = styled.div`
  font-family: 'Godo B';
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.black};
`;

const CommentTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-family: 'Godo B';
  display: flex;
  justify-content: left;
  margin-left: 30px;
`;
