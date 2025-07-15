import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ButtonBorder, ButtonYbShadow } from '../../styles/Button.styles.js';
import { useNavigate, useParams } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { worcationService } from '../../api/worcations.js';
import useAuthStore from '../../store/authStore.js';

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
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [appData, setAppData] = useState(null);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    centerMode: true,
    centerPadding: '100px',
  };
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

  //숙소 유형에 따른 정보 출력
  const renderBlocks = () => {
    switch (worcation?.worcation_category) {
      case 'Office':
        return (
          <Block>
            <BlockTitle>오피스</BlockTitle>
            <BlockText>
              - 운용시간 : {officeTime || '미입력'}
              <br />- 연락처 : {worcation?.worcation_tel || '-'}
              <br />- 수용인원 : {worcation?.max_people || '-'}
              <br />- 홈페이지 : {worcation?.content || '-'}
            </BlockText>
          </Block>
        );
      case 'Accommodation':
        return (
          <Block>
            <BlockTitle>숙소</BlockTitle>
            <BlockText>
              - 입실/퇴실 : {accomTime || '미입력'}
              <br />- 연락처 : {worcation?.worcation_tel || '-'}
              <br />- 최대인원 : {worcation?.max_people || '-'}
              <br />- 홈페이지 : {worcation?.content || '-'}
            </BlockText>
          </Block>
        );
      case 'OfficeAndStay':
        return (
          <>
            <Block>
              <BlockTitle>오피스</BlockTitle>
              <BlockText>
                - 운용시간 : {officeTime || '미입력'}
                <br />- 연락처 : {worcation?.worcation_tel || '-'}
                <br />- 수용인원 : {worcation?.max_people || '-'}
                <br />- 홈페이지 : {worcation?.content || '-'}
              </BlockText>
            </Block>
            <Block>
              <BlockTitle>숙소</BlockTitle>
              <BlockText>
                - 입실/퇴실 : {accomTime || '미입력'}
                <br />- 연락처 : {detail?.worcation_tel || '-'}
                <br />- 최대인원 : {worcation?.max_people || '-'}
                <br />- 홈페이지 : {detail?.content || '-'}
              </BlockText>
            </Block>
          </>
        );
      default:
        return null;
    }
  };

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

  const handleEditClick = (review) => {
    setEditingId(review.review_no);
    setEditedContent(review.review_content);
  };

  const handleSaveEdit = async (review_no) => {
    try {
      await worcationService.updateReview(review_no, {
        review_content: editedContent,
        update_at: new Date().toISOString(),
      });
      alert('댓글을 수정하였습니다.');

      setEditingId(null);
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

  return (
    <PageContainer>
      <Wrapper>
        <MainImageWrapper>
          {loginUser && (
            <TopButtons>
              {loginUser.role !== 'EMPLOYEE' && loginUser.role !== 'WORCATION' && (
                <ButtonBorder onClick={() => navigate(`/partnership/apply/`)}>제휴 신청</ButtonBorder>
              )}
              {loginUser.role !== 'WORCATION' && (
                <ButtonBorder onClick={() => navigate('/worcation/apply', { state: { worcation } })}>예약</ButtonBorder>
              )}
            </TopButtons>
          )}
        </MainImageWrapper>

        <Title>{worcation.worcation_name}</Title>
        <PhotoGallery>
          <PhotoSliderWrapper>
            {images.length > 1 ? (
              <Slider {...settings}>
                {images.map((src, idx) => (
                  <picture key={idx}>
                    <SliderImage src={src} alt={`slide-${idx}`} loading="lazy" />
                  </picture>
                ))}
              </Slider>
            ) : (
              images.length === 1 && (
                <picture>
                  <SliderImage src={images[0]} alt="slide-0" loading="lazy" />
                </picture>
              )
            )}
          </PhotoSliderWrapper>
        </PhotoGallery>
        <PriceWrapper>
          <Price>{worcation.non_partner_price?.toLocaleString()} 원</Price>
        </PriceWrapper>

        <ContentSection>
          {renderBlocks()}
          <Block>
            <BlockTitle>위치 및 상세 설명</BlockTitle>
            <BlockText>
              <br />- 주소 : {worcation?.worcation_address}
              <br />- 오시는 길 : {detail?.navigate}
            </BlockText>
          </Block>
          <Block>
            <BlockTitle>사업자 정보</BlockTitle>
            <BlockText>
              - 대표 이사 : {detail?.licensee}
              <br />- 사업자등록번호 : {detail?.business_id}
              <br />- 기업명 : {detail?.licensee}
            </BlockText>
          </Block>
          <Block>
            <BlockTitle>워케이션 소개</BlockTitle>
            <BlockText>
              {detail?.content}
              <br />
              이용 가격 : {detail?.charge_amount}
              <br />
              숙소 형태 : {features[0]?.accommodation_type || '미지정'}
              <br />
              환불 정책 : {detail?.refund_policy}
              <br />
              여가 활동 : {features[0]?.activities || '없음'}
            </BlockText>
          </Block>
          <Block>
            <BlockTitle>편의 시설</BlockTitle>
            <BlockText>
              {amenities.length > 0 ? (
                amenities.map((item, index) => <div key={index}>- {item.amenity_name}</div>)
              ) : (
                <>등록된 편의 시설이 없습니다.</>
              )}
            </BlockText>
          </Block>
        </ContentSection>
      </Wrapper>

      <CommentTitle>댓글 ({reviews ? reviews.length : 0})</CommentTitle>
      <Wrapper2>
        <ContentSection>
          <CommentInputWrap>
            {isDisabled && <Overlay>댓글 작성은 워케이션 이용후 이용 가능합니다.</Overlay>}
            <CommentInput
              placeholder="댓글을 입력하세요."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isDisabled}
            />
            <CommentSubmit as={ButtonYbShadow} onClick={handleAddComment} disabled={isDisabled}>
              등록
            </CommentSubmit>
          </CommentInputWrap>
          <CommentList>
            {reviews.map((review) => (
              <CommentItem key={review.review_no}>
                <CommentUser>{review.writer_id} :</CommentUser>
                {editingId === review.review_no ? (
                  <>
                    <CommentText>
                      <CommentInput value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
                    </CommentText>
                    <CommentActions>
                      <ActionBtn onClick={() => handleSaveEdit(review.review_no)}>저장</ActionBtn>
                      <ActionBtn onClick={() => setEditingId(null)}>취소</ActionBtn>
                    </CommentActions>
                  </>
                ) : (
                  <>
                    <CommentText>{review.review_content}</CommentText>

                    <CommentActions>
                      {review.writer_id === loginUser?.user_id ? (
                        <>
                          <ActionBtn onClick={() => handleEditClick(review)}>수정</ActionBtn>
                          <ActionBtn onClick={() => handleDelete(review.review_no)}>삭제</ActionBtn>
                        </>
                      ) : (
                        <>
                          <ActionBtn style={{ visibility: 'hidden' }}>수정</ActionBtn>
                          <ActionBtn style={{ visibility: 'hidden' }}>삭제</ActionBtn>
                        </>
                      )}
                    </CommentActions>
                  </>
                )}
              </CommentItem>
            ))}
          </CommentList>
        </ContentSection>
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

const PhotoSliderWrapper = styled.div`
  width: 100%;
  margin: 30px auto;
`;

const SliderImage = styled.img`
  width: 100%;
  max-width: 600px;
  height: 400px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: block;
  margin: 0 auto;
`;

const PhotoGallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
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

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  text-align: left;
`;

const Block = styled.div`
  margin-bottom: 80px;
  margin-left: 50px;
`;

const BlockTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-family: 'Godo B';
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 20px;
`;

const BlockText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-family: 'Godo B';
  color: ${({ theme }) => theme.colors.black};
  line-height: 2.5;
`;

const CommentTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-family: 'Godo B';
  display: flex;
  justify-content: left;
  margin-left: 30px;
`;

const CommentInputWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
`;

const CommentInput = styled.input`
  flex: 1;
  width: 100%;
  height: 50px;
  border: 2px solid ${({ theme }) => theme.colors.gray[400]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 0 10px;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-family: 'GyeonggiTitleOTF';
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
`;

const CommentSubmit = styled.button``;

const CommentList = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 20px;
`;

const CommentItem = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.black};
  padding: 10px 0;
`;

const CommentUser = styled.span`
  flex-basis: 10%;
  min-width: 80px;
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-family: 'GyeonggiTitleOTF';
`;

const CommentText = styled.div`
  flex-basis: 80%;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  flex: 1;
  margin: 0 10px;
  display: flex;
  align-items: center;
  padding: 0;
`;

const CommentActions = styled.div`
  flex-basis: 10%;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const ActionBtn = styled.button`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 5px 10px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  font-family: 'Godo B';
  color: ${({ theme }) => theme.colors.black};
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 1);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #e2e2e2;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
`;
