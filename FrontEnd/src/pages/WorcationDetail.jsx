import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ButtonBorder, ButtonYbShadow } from '../styles/Button.styles';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import useUserStore from '../store/userStore.js';

const WorcationDetail = () => {
  // const navigate = useNavigate();
  const loginUserId = 'user01@example.com'; //추후 불러오는걸로 수정 필요
  // const loginUserId = useUserStore((state) => state.loginUser?.userId);  아마 이걸로 수정할 듯
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

  useEffect(() => {
    axios
      .get(`http://localhost:3001/worcation?worcation_no=${worcationNo}`)
      .then((res) => setWorcation(res.data[0]))
      .catch(console.error);
    axios
      .get(`http://localhost:3001/worcation_detail?worcation_no=${worcationNo}`)
      .then((res) => setDetail(res.data[0]))
      .catch(console.error);

    axios
      .get(`http://localhost:3001/review?application_no=${worcationNo}`)
      .then((res) => setReviews(res.data))
      .catch(console.error);

    axios
      .get(`http://localhost:3001/worcation_features?worcation_no=${worcationNo}`)
      .then((res) => setFeatures(res.data))
      .catch(console.error);

    axios
      .get(`http://localhost:3001/photo?worcation_no=${worcationNo}`)
      .then((res) => setPhotos(res.data))
      .catch(console.error);

    const fetchAmenities = async () => {
      try {
        const amRes = await axios.get(`http://localhost:3001/worcation_amenity?worcation_no=${worcationNo}`);
        const amenityNos = amRes.data.map((a) => a.amenity_no);

        const allAmenities = await axios.get('http://localhost:3001/amenity');
        const matched = allAmenities.data.filter((am) => amenityNos.includes(am.amenity_no));

        setAmenities(matched);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAmenities();
  }, [worcationNo]);

  if (!detail) return null;
  const [officeTime, accomTime] = detail?.available_time?.split('/') || ['', ''];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  //숙소 유형에 따른 정보 출력
  const renderBlocks = () => {
    switch (worcation?.worcation_category) {
      case 'Office':
        return (
          <Block>
            <BlockTitle>오피스</BlockTitle>
            <BlockText>
              - 운용시간 : {officeTime || '미입력'}
              <br />- 연락처 : {detail?.worcation_tel || '-'}
              <br />- 수용인원 : {worcation?.max_people || '-'}
              <br />- 홈페이지 : {detail?.content || '-'}
            </BlockText>
          </Block>
        );
      case 'Accommodation':
        return (
          <Block>
            <BlockTitle>숙소</BlockTitle>
            <BlockText>
              - 입실/퇴실 : {accomTime || '미입력'}
              <br />- 연락처 : {detail?.worcation_tel || '-'}
              <br />- 최대인원 : {worcation?.max_people || '-'}
              <br />- 홈페이지 : {detail?.content || '-'}
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
                <br />- 연락처 : {detail?.worcation_tel || '-'}
                <br />- 수용인원 : {worcation?.max_people || '-'}
                <br />- 홈페이지 : {detail?.content || '-'}
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

  const handleAddComment = () => {
    const review = {
      application_no: Number(worcationNo),
      writer_id: loginUserId,
      review_content: newComment,
      create_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
    };

    axios
      .post('http://localhost:3001/review', review)
      .then(() => {
        setReviews((prev) => [...prev, review]);
        setNewComment('');
      })
      .catch(console.error);
  };
  const handleEditClick = (review) => {
    setEditingId(review.review_no);
    setEditedContent(review.review_content);
  };

  const handleSaveEdit = (reviewNo) => {
    axios
      .patch(`http://localhost:3001/review/${reviewNo}`, {
        review_content: editedContent,
        update_at: new Date().toISOString(),
      })
      .then(() => {
        setReviews((prev) =>
          prev.map((r) =>
            r.review_no === reviewNo ? { ...r, review_content: editedContent, update_at: new Date().toISOString() } : r
          )
        );
        setEditingId(null);
        setEditedContent('');
      })
      .catch(console.error);
  };
  const handleDelete = (reviewNo) => {
    axios
      .delete(`http://localhost:3001/review/${reviewNo}`)
      .then(() => {
        //UI에서 삭제
        setReviews((prev) => prev.filter((r) => r.review_no !== reviewNo));
      })
      .catch(console.error);
  };

  //UI
  return (
    <PageContainer>
      <Wrapper>
        <MainImageWrapper>
          <TopButtons>
            <ButtonBorder onClick={() => navigate(`/partnership/apply/`)}>제휴 신청</ButtonBorder>
            <ButtonBorder onClick={() => navigate(`/worcation/apply/`)}>예약</ButtonBorder>
          </TopButtons>
        </MainImageWrapper>

        <Title>{worcation.worcation_name}</Title>
        <PhotoGallery>
          <PhotoSliderWrapper>
            <Slider {...settings}>
              {[worcation.main_change_photo, ...photos.map((p) => p.change_name)].map((src, idx) => (
                <SliderImage key={idx} src={src} alt={`slide-${idx}`} />
              ))}
            </Slider>
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
              <br />- 주소 : {worcation?.address}
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

      <CommentTitle>댓글 ({reviews.length})</CommentTitle>
      <Wrapper2>
        <ContentSection>
          <CommentInputWrap>
            <CommentInput
              placeholder="댓글을 입력하세요."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <CommentSubmit as={ButtonYbShadow} onClick={handleAddComment}>
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

                    {review.writer_id === loginUserId && (
                      <CommentActions>
                        <ActionBtn onClick={() => handleEditClick(review)}>수정</ActionBtn>
                        <ActionBtn onClick={() => handleDelete(review.review_no)}>삭제</ActionBtn>
                      </CommentActions>
                    )}
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
  width: 80%;
  margin: 30px auto;
`;

const SliderImage = styled.img`
  height: 400px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
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
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
`;

const CommentInput = styled.input`
  flex: 1;
  height: 50px;
  border: 2px solid ${({ theme }) => theme.colors.gray[400]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 0 20px;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-family: 'GyeonggiTitleOTF';
`;

const CommentSubmit = styled.button``;

const CommentList = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 20px;
`;

const CommentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.black};
  padding: 10px 0;
`;

const CommentUser = styled.span`
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-family: 'GyeonggiTitleOTF';
  width: 20%;
`;

const CommentText = styled.span`
  margin-right: 200px;
  width: auto;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  flex: 1;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 10px;
  width: 10%;
`;

const ActionBtn = styled.button`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 5px 10px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  font-family: 'Godo B';
`;
