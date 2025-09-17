import React from 'react';
import styled from 'styled-components';
import { Title, Subtitle } from '../../styles/Typography';
import { Link } from 'react-router-dom';
import bodyImg from '../../assets/body.png';
import brainImg from '../../assets/brain.png';

const NonCompleteTest = ({ body, stress, burnout, preference }) => {
  return (
    <div>
      <Title>AI 추천 식단 정보를 보기 위해서는 다음 결과지가 필요해요!</Title>
      <Choice>
        <Element>
          {body ? (
            <>
              <Image src={bodyImg} alt="body"></Image>
              <Subtitle>나의 신체 정보가 등록되어있어요.</Subtitle>
            </>
          ) : (
            <>
              <Link to="/my/body">
                <Image src={bodyImg} alt="body"></Image>
                <Subtitle>나의 신체 정보를 등록</Subtitle>
              </Link>
            </>
          )}
        </Element>
        <Element>
          {stress && burnout && preference ? (
            <>
              <Image src={brainImg} alt="brain"></Image>
              <Subtitle>심리 테스트를 마쳤어요</Subtitle>
            </>
          ) : (
            <>
              <Link to="/trial">
                <Image src={brainImg} alt="brain"></Image>
                <Subtitle>심리 테스트 하기</Subtitle>
                <p>등록 기간이 한 달 지나면 다시 등록해야해요!</p>
              </Link>
            </>
          )}
        </Element>
      </Choice>
    </div>
  );
};

export default NonCompleteTest;

const Image = styled.img`
  width: 566px;
  height: 400px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;
  background: ${({ theme }) => theme.colors.secondary};
`;

const Element = styled.div``;

const Choice = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 40px;
`;
