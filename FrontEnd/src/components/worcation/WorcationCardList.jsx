import React from 'react'

const WorcationCardList = ({ data, reviews, navigate }) => (
    <CardList>
      {data.map((item) => (
        <PlaceCard key={item.worcation_no}>
          <PlaceImage src={item.main_change_photo} alt={item.worcation_name} />
          <CardContent>
            <InfoBlock>
              <PlaceLocation>{item.address}</PlaceLocation>
              <PlaceName>{item.worcation_name}</PlaceName>
              <PlaceReview>
                리뷰 ({reviews.filter((r) => r.application_no === item.worcation_no).length})
              </PlaceReview>
            </InfoBlock>
            <ThemeBlock>
              <ThemeLabel>테마</ThemeLabel>
              <ThemeText>{item.worcation_thema || '미지정'}</ThemeText>
              <ButtonDetail onClick={() => navigate(`/worcation/${item.worcation_no}`)}>상세보기</ButtonDetail>
            </ThemeBlock>
          </CardContent>
        </PlaceCard>
      ))}
    </CardList>
  );

export default WorcationCardList
  