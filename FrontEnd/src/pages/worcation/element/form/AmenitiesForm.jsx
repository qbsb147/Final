import React, { useState } from 'react';
import styled from 'styled-components';
import { ButtonBorder } from '../../../../styles/Button.styles.js';
import Checkbox from '../../../../components/common/Checkbox.jsx';

const Form = () => {
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const handleAmenityChange = (value) => {
    setSelectedAmenities((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const amenities = [
    // office
    { label: '고속 와이파이', value: 'high_speed_wifi', category: 'office' },
    { label: '소회의실', value: 'small_meeting_room', category: 'office' },
    { label: '화상회의 부스', value: 'video_conference_booth', category: 'office' },
    { label: '프린터', value: 'printer', category: 'office' },
    { label: '개인 업무 책상', value: 'personal_desk', category: 'office' },
    { label: '멀티탭', value: 'power_strip', category: 'office' },

    // stay
    { label: '에어컨', value: 'air_conditioner', category: 'stay' },
    { label: '조리공간', value: 'kitchen_area', category: 'stay' },
    { label: '세탁기', value: 'washing_machine', category: 'stay' },
    { label: '편의점 도보거리', value: 'convenience_store_nearby', category: 'stay' },
    { label: '주차', value: 'parking', category: 'stay' },
    { label: '청소 서비스', value: 'cleaning_service', category: 'stay' },

    // relax
    { label: '전용 테라스', value: 'private_terrace', category: 'relax' },
    { label: '루프탑', value: 'rooftop', category: 'relax' },
    { label: '피트니스', value: 'fitness', category: 'relax' },
    { label: '자연 접근성', value: 'nature_accessibility', category: 'relax' },
    { label: '요가 공간', value: 'yoga_space', category: 'relax' },

    // safety
    { label: '보안 도어락', value: 'secure_door_lock', category: 'safety' },
    { label: 'CCTV', value: 'cctv', category: 'safety' },
    { label: '전용 입구', value: 'private_entrance', category: 'safety' },
    { label: '라커', value: 'locker', category: 'safety' },

    // digital
    { label: '무인 체크인', value: 'self_checkin', category: 'digital' },
    { label: '모바일 컨시어지', value: 'mobile_concierge', category: 'digital' },
    { label: '커뮤니티 기능', value: 'community_features', category: 'digital' },
  ];

  const getAmenitiesByCategory = (category) => {
    return amenities.filter((item) => item.category === category);
  };

  return (
    <Body>
      <Title>편의시설을 선택해주세요.(다중 선택 가능)</Title>
      <Table>
        <TBody>
          <TR>
            <TH>오피스 시설</TH>
            <TD>
              <AmenitiesContainer>
                {getAmenitiesByCategory('office').map((amenity) => (
                  <Checkbox
                    key={amenity.value}
                    id={amenity.value}
                    label={amenity.label}
                    checked={selectedAmenities.includes(amenity.value)}
                    onChange={() => handleAmenityChange(amenity.value)}
                  />
                ))}
              </AmenitiesContainer>
            </TD>
          </TR>
          <TR>
            <TH>숙소 시설</TH>
            <TD>
              <AmenitiesContainer>
                {getAmenitiesByCategory('stay').map((amenity) => (
                  <Checkbox
                    key={amenity.value}
                    id={amenity.value}
                    label={amenity.label}
                    checked={selectedAmenities.includes(amenity.value)}
                    onChange={() => handleAmenityChange(amenity.value)}
                  />
                ))}
              </AmenitiesContainer>
            </TD>
          </TR>
          <TR>
            <TH>휴식 공간</TH>
            <TD>
              <AmenitiesContainer>
                {getAmenitiesByCategory('relax').map((amenity) => (
                  <Checkbox
                    key={amenity.value}
                    id={amenity.value}
                    label={amenity.label}
                    checked={selectedAmenities.includes(amenity.value)}
                    onChange={() => handleAmenityChange(amenity.value)}
                  />
                ))}
              </AmenitiesContainer>
            </TD>
          </TR>
          <TR>
            <TH>안전 시설</TH>
            <TD>
              <AmenitiesContainer>
                {getAmenitiesByCategory('safety').map((amenity) => (
                  <Checkbox
                    key={amenity.value}
                    id={amenity.value}
                    label={amenity.label}
                    checked={selectedAmenities.includes(amenity.value)}
                    onChange={() => handleAmenityChange(amenity.value)}
                  />
                ))}
              </AmenitiesContainer>
            </TD>
          </TR>
          <TR>
            <TH>디지털 서비스</TH>
            <TD>
              <AmenitiesContainer>
                {getAmenitiesByCategory('digital').map((amenity) => (
                  <Checkbox
                    key={amenity.value}
                    id={amenity.value}
                    label={amenity.label}
                    checked={selectedAmenities.includes(amenity.value)}
                    onChange={() => handleAmenityChange(amenity.value)}
                  />
                ))}
              </AmenitiesContainer>
            </TD>
          </TR>
        </TBody>
      </Table>
    </Body>
  );
};

export default Form;

const Body = styled.div`
  padding: 40px;
  gap: 40px;
  height: 562px;
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  flex-direction: column;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray[100]};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[300]};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const Title = styled.div`
  text-align: start;
`;

const Table = styled.table`
  width: 100%;
  border-spacing: 16px 12px;
  min-width: 800px;
`;
const TBody = styled.tbody`
  display: flex;
  flex-direction: column;
  gap: 42px;
`;

const TR = styled.tr`
  vertical-align: middle;
  display: flex;
`;

const TH = styled.th`
  text-align: left;
  vertical-align: middle;
  width: 200px;
  font-weight: 500;
`;

const TD = styled.td`
  display: flex;
`;

const AmenitiesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
`;

const ButtonYellow = styled(ButtonBorder)`
  height: 30px;
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin-left: 50px;
`;
