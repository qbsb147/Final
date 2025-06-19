// WorcationDetail.jsx (theme 활용 최적화)
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ButtonBorder, ButtonYbShadow } from '../styles/Button.styles';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const WorcationDetail = () => {
  const navigate = useNavigate();
  const { worcationNo } = useParams();
  const [detail, setDetail] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/worcation/${worcationNo}`)
      .then((res) => setDetail(res.data))
      .catch(console.error);

    axios
      .get(`http://localhost:3001/review/${worcationNo}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error(err));
  }, [worcationNo]);

  const renderBlocks = () => {
    switch (detail?.worcation_category) {
      case 'Office':
        return (
          <Block>
            <BlockTitle>오피스</BlockTitle>
            <BlockText>
              - 운용시간 : 09:00 ~ 18:00
              <br />- 연락처 : 010-1111-5555
              <br />- 수용인원 : 40
              <br />- 홈페이지 : https://office.example.com
            </BlockText>
          </Block>
        );
      case 'Accommodation':
        return (
          <Block>
            <BlockTitle>숙소</BlockTitle>
            <BlockText>
              - 입실 : 14:00 퇴실: 12:00
              <br />- 연락처 : 010-1111-5555
              <br />- 최대인원 : 50
              <br />- 홈페이지 : https://stay.example.com
            </BlockText>
          </Block>
        );
      case 'OfficeAndStay':
        return (
          <>
            <Block>
              <BlockTitle>오피스</BlockTitle>
              <BlockText>
                - 운용시간 : 09:00 ~ 18:00
                <br />- 연락처 : 010-1111-5555
                <br />- 수용인원 : 40
                <br />- 홈페이지 : https://office.example.com
              </BlockText>
            </Block>
            <Block>
              <BlockTitle>숙소</BlockTitle>
              <BlockText>
                - 입실 : 14:00 퇴실: 12:00
                <br />- 연락처 : 010-1111-5555
                <br />- 최대인원 : 50
                <br />- 홈페이지 : https://stay.example.com
              </BlockText>
            </Block>
          </>
        );
      default:
        return null;
    }
  };
  return (
    <PageContainer>
      <Wrapper>
        <MainImageWrapper>
          <TopButtons>
            <ButtonBorder>제휴 신청</ButtonBorder>
            <ButtonBorder>예약</ButtonBorder>
          </TopButtons>
        </MainImageWrapper>

        <Title>{detail.worcation_name}</Title>
        <MainImage src={detail.main_change_photo} />
        <PriceWrapper>
          <Price>{detail.non_partner_price?.toLocaleString()}원</Price>
        </PriceWrapper>

        <ContentSection>
          <Block>
            <BlockTitle>오피스</BlockTitle>
            <BlockText>
              - 운용시간 : 09:00 ~ 18:00
              <br />- 연락처 : 010-1111-5555
              <br />- 수용인원 : 40
              <br />- 홈페이지 : https://asdasd
            </BlockText>
          </Block>
          <Block>
            <BlockTitle>숙소</BlockTitle>
            <BlockText>
              - 입실 : 14:00 퇴실: 12:00
              <br />- 연락처 : 010-1111-5555
              <br />- 최대인원 : 50
              <br />- 홈페이지 : https://asdasd
            </BlockText>
          </Block>
          <Block>
            <BlockTitle>위치 및 상세 설명</BlockTitle>
            <BlockText>
              - 오피스 : 서귀포시 중정로 21, 22
              <br />- 숙소 : ~~~~~~
              <br />- 오시는 길 :<br />
              해운대구 센텀시티의 중심부에 위치해 있으며,
              <br />
              호텔에서 벡스코(BEXCO)까지 도보로 3분, 센텀시티역 11번 출구까지 도보 5분 거리에 위치해 있습니다.
            </BlockText>
          </Block>
          <Block>
            <BlockTitle>사업자 정보</BlockTitle>
            <BlockText>
              - 대표 이사 : OOO
              <br />- 사업자등록번호 : 221-81-51032
              <br />- 기업명 : (주) 간세
            </BlockText>
          </Block>
          <Block>
            <BlockTitle>워케이션 소개</BlockTitle>
            <BlockText>
              도보 여행자와 제주를 잇는 로컬 체험 플랫폼
              <br />
              민크코리아가 운영하고 협력합니다.
              <br />
              제주시 도두 바다 위쪽에 위치하여 바다가 한눈에 보이는 오피스입니다. 제주공항 10분 거리 위치합니다.
              <br />
              주변 상권과 인프라가 발달되어 있어 제주 고유의 문화와 분위기를 가득 느낄 수 있습니다.
            </BlockText>
          </Block>
          <Block>
            <BlockTitle>편의 시설</BlockTitle>
            <BlockText>
              - 식당, 연회장, 공유 오피스
              <br />- 오피스 좌석 : 8석
              <br />- 소회의실 : 4인 1실
              <br />- 대회의실 : 40인 1실
              <br />- 휴게실 : 본관 1층
            </BlockText>
          </Block>
        </ContentSection>
      </Wrapper>

      <CommentTitle>댓글 ({reviews.length})</CommentTitle>
      <Wrapper2>
        <ContentSection>
          <CommentInputWrap>
            <CommentInput placeholder="댓글을 입력하세요." />
            <CommentSubmit as={ButtonYbShadow}>등록</CommentSubmit>
          </CommentInputWrap>
          <CommentList>
            <CommentItem>
              <CommentUser>User01 :</CommentUser>
              <CommentText>잘 쉬다 갑니다</CommentText>
              <CommentActions>
                <ActionBtn>수정</ActionBtn>
                <ActionBtn>삭제</ActionBtn>
              </CommentActions>
            </CommentItem>
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
  width: 100%;
  margin-bottom: 40px;
  position: relative;
`;

const MainImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.md};
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

const BlockText = styled.p`
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
`;

const CommentText = styled.span`
  margin-right: 750px;
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const CommentActions = styled.div`
  display: flex;
  gap: 10px;
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
