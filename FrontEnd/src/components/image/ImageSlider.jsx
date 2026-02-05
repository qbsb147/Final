import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ImageSlider = ({ images }) => {
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

  return (
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
  );
};

const SliderImage = styled.img`
  width: 100%;
  max-width: 600px;
  height: 400px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: block;
  margin: 0 auto;
`;

const PhotoSliderWrapper = styled.div`
  width: 100%;
  margin: 30px auto;
`;

const PhotoGallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
`;

export default ImageSlider;
