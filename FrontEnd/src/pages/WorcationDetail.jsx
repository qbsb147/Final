import React from 'react';
import styled from 'styled-components';
import Button from '../styles/Button';
import seoulImage from '../assets/seoul1.jpg';

const WorcationDetail = () => {
  return (
    <PageContainer>
      <Wrapper>
        <MainImageWrapper>
          <TopButtons>
            <PartnerButton style={Button.buttonBorder}>제휴 신청</PartnerButton>
            <ReserveButton style={Button.buttonBorder}>예약</ReserveButton>
          </TopButtons>
        </MainImageWrapper>

        <Title>포포인츠 알파이 워케이션</Title>
        <MainImage src={seoulImage} />
        <PriceWrapper>
          <Price>50,000원</Price>
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

      <CommentTitle>댓글 (1)</CommentTitle>
      <Wrapper2>
        <ContentSection>
          <CommentInputWrap>
            <CommentInput placeholder="댓글을 입력하세요." />
            <CommentSubmit>등록</CommentSubmit>
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
  background-color: #fff;
`;

const Wrapper = styled.div`
  width: auto;
  margin: 50px auto;
  background: rgba(196, 196, 196, 0.1);
  border-top: 1px solid #5c3b00;
  border-bottom: 2px solid #5c3b00;
  padding: 60px;
  box-sizing: border-box;
`;

const Wrapper2 = styled.div`
  width: auto;
  background: rgba(196, 196, 196, 0.1);
  border-top: 1px solid #5c3b00;
  border-bottom: 2px solid #5c3b00;
  padding: 60px;
  box-sizing: border-box;
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
  border-radius: 10px;
`;

const TopButtons = styled.div`
  position: absolute;
  right: 20px;
  display: flex;
  gap: 20px;
`;

const PartnerButton = styled.button`
  width: 150px;
  height: 50px;
  cursor: pointer;
`;

const ReserveButton = styled(PartnerButton)`
  background: #ffeb8c;
`;

const Title = styled.h1`
  font-size: 36px;
  font-family: 'Godo B';
  color: #000;
  margin-top: 80px;
  margin-bottom: 30px;
`;

const PriceWrapper = styled.div`
  text-align: right;
  margin: 10px 0 40px;
`;

const Price = styled.div`
  font-family: 'Godo B';
  font-size: 30px;
  color: #000;
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
  font-size: 28px;
  font-family: 'Godo B';
  color: #000;
  margin-bottom: 20px;
`;

const BlockText = styled.p`
  font-size: 16px;
  font-family: 'Godo B';
  color: #000;
  line-height: 2.5;
`;

const CommentTitle = styled.h3`
  font-size: 30px;
  color: #555;
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
  border: 2px solid #a1a1a1;
  border-radius: 15px;
  padding: 0 20px;
  font-size: 18px;
  font-family: 'GyeonggiTitleOTF';
`;

const CommentSubmit = styled.button`
  width: 100px;
  height: 50px;
  background: #ffeb8c;
  border: 1px solid #000;
  border-radius: 10px;
  font-family: 'Godo B';
  font-size: 18px;
  cursor: pointer;
`;

const CommentList = styled.div`
  border: 2px solid #000;
  border-radius: 15px 15px 0 0;
  padding: 20px;
`;

const CommentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #000;
  padding: 10px 0;
`;

const CommentUser = styled.span`
  font-weight: bold;
  font-size: 20px;
  font-family: 'GyeonggiTitleOTF';
`;

const CommentText = styled.span`
  margin-right: 750px;
  font-size: 20px;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionBtn = styled.button`
  background: #fff;
  border: 1px solid #000;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  font-family: 'Godo B';
`;
