import React from 'react';
import styled from 'styled-components';
import { Title, Subtitle } from '../../../styles/Typography';
import userStore from '../../../store/userStore';
import { Link } from 'react-router-dom';

const NonCompleteTest = () => {
  const { body, stress, burnout, tendency } = userStore();
  return (
    <div>
      {' '}
      <Title>AI 추천 식단 정보를 보기 위해서는 다음 결과지가 필요해요!</Title>
      <Choice>
        <Element>
          <Image src="src/assets/body.png" alt="body"></Image>
          {body ? (
            <>
              <Subtitle>나의 신체 정보가 등록되어있어요.</Subtitle>
            </>
          ) : (
            <>
              <Subtitle>나의 신체 정보를 등록</Subtitle>
            </>
          )}
        </Element>
        <Element>
          {stress && burnout && tendency ? (
            <>
              <Image src="src/assets/brain.png" alt="brain"></Image>

              <Subtitle>심리 테스트를 마쳤어요</Subtitle>
            </>
          ) : (
            <>
              <Link to="/trial">
                <Image src="src/assets/brain.png" alt="brain"></Image>
                <Subtitle>심리 테스트 하기</Subtitle>
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
