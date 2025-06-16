import Button from '../styles/Button';
import styled from 'styled-components';
import { Col } from 'antd';

const Trial = () => {
  return (
    <>
      <Content>
        <TestBox>
          <NameBox>
            <TestName>스트레스 검사</TestName>
            <ExplanationBox>
              <Img
                src="src/assets/stress.png"
                alt="Rectangle"
                style={{ width: '130px', height: '100px', objectFit: 'cover' }}
              />
              <Explanation>마음이 무겁게 느껴질 때, 스트레스 검사를 통해 내 상태를 한 번 체크해보세요.</Explanation>
            </ExplanationBox>
          </NameBox>
          <Textbox>
            <button style={Button.buttonWhite2}>테스트하러 가기</button>
          </Textbox>
        </TestBox>
        <TestBox>
          <NameBox>
            <TestName>번아웃 검사</TestName>
            <ExplanationBox>
              <Img
                src="src/assets/bunout.png"
                alt="Rectangle"
                style={{ width: '130px', height: '100px', objectFit: 'cover' }}
              />
              <Explanation>
                요즘 유난히 피로하고 무기력하다면, 번아웃 검사를 통해 나의 소진 상태를 점검해보세요.
              </Explanation>
            </ExplanationBox>
          </NameBox>
          <Textbox>
            <button style={Button.buttonWhite2}>테스트하러 가기</button>
          </Textbox>
        </TestBox>
        <TestBox>
          <NameBox>
            <TestName>성향 검사</TestName>
            <ExplanationBox>
              <Img
                src="src/assets/tendency.png"
                alt="Rectangle"
                style={{ width: '130px', height: '100px', objectFit: 'cover' }}
              />
              <Explanation>워케이션 전, 성향검사로 나에게 맞는 휴식을 찾아보세요.</Explanation>
            </ExplanationBox>
          </NameBox>
          <Textbox>
            <button style={Button.buttonWhite2}>테스트하러 가기</button>
          </Textbox>
        </TestBox>
      </Content>
    </>
  );
};

const Img = styled.img`
  box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.3);
`;

const TestBox = styled.div`
  display: flex;
  width: 1000px;
`;

const Textbox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 500px;
  height: 150px;
  background: ${({ theme }) => theme.colors.primary};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column; /* 요소들을 세로로 쌓기 */
  justify-content: center; /* 수직 가운데 정렬 (column일 때는 수직) */
  align-items: center; /* 수평 가운데 정렬 */
  padding: 30px;
  background: ${({ theme }) => theme.colors.gray['100']};
  width: 100%;
  gap: ${({ theme }) => theme.spacing.s3};
`;

const NameBox = styled.div`
  width: 500px;
  background: ${({ theme }) => theme.colors.white};
`;

const TestName = styled.p`
  display: flex;
  padding-left: 10px;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const ExplanationBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Explanation = styled.p`
  padding-left: ${({ theme }) => theme.spacing.s3};
  width: 300px;
`;

export default Trial;
