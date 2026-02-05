// src/pages/worcation/components/detail/WorcationInfo.jsx
import React from 'react';
import styled from 'styled-components';

const WorcationInfo = ({ worcation, officeTime, accomTime, detail, features, amenities }) => {
  if (!worcation) return null;

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

  return (
    <InfoContainer>
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
    </InfoContainer>
  );
};

const InfoContainer = styled.div`
  margin: 20px 0;
`;

const Block = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const BlockTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
`;

const BlockText = styled.p`
  margin: 0;
  line-height: 1.6;
  color: #555;
  white-space: pre-line;
`;

export default WorcationInfo;
