import Button from '../../styles/Button';
import styled from 'styled-components';
import { WhiteButtonLink } from '../../styles/Link.styles';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { mentalService } from '../../api/mentals';

const Trial = () => {
  const [stress, setStress] = useState('');
  const [burnout, setBurnout] = useState('');
  const [preference, setPreference] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { stress, burnout, preference } = await mentalService.getMentals();

        setStress(stress);
        setBurnout(burnout);
        setPreference(preference);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Content>
        <TestBox>
          <NameBox>
            <TestName>스트레스 검사</TestName>
            <ExplanationBox>
              <Img src="src/assets/stress.png" alt="Rectangle" />
              <Explanation>마음이 무겁게 느껴질 때, 스트레스 검사를 통해 내 상태를 한 번 체크해보세요.</Explanation>
            </ExplanationBox>
          </NameBox>
          <Textbox>
            {stress ? (
              <>
                {new Date(stress.update_date) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? (
                  <WhiteButtonLink to="/trial/stress">
                    <div>스트레스 검사한지 한달이 지났습니다.</div>재검사를 실시하세요.
                  </WhiteButtonLink>
                ) : (
                  <ResultContent>
                    <Result>{stress.result_content}</Result>
                    <Score>{stress.score}점</Score>
                  </ResultContent>
                )}
              </>
            ) : (
              <WhiteButtonLink to="/trial/stress">테스트하러 가기</WhiteButtonLink>
            )}
          </Textbox>
        </TestBox>
        <TestBox>
          <NameBox>
            <TestName>번아웃 검사</TestName>
            <ExplanationBox>
              <Img src="src/assets/bunout.png" alt="Rectangle" />
              <Explanation>
                요즘 유난히 피로하고 무기력하다면, 번아웃 검사를 통해 나의 소진 상태를 점검해보세요.
              </Explanation>
            </ExplanationBox>
          </NameBox>
          <Textbox>
            {burnout ? (
              <>
                {new Date(burnout.update_date) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? (
                  <WhiteButtonLink to="/trial/burnout">
                    <div>번아웃 검사한지 한달이 지났습니다.</div>재검사를 실시하세요.
                  </WhiteButtonLink>
                ) : (
                  <ResultContent>
                    <Result>{burnout.result_content}</Result>
                    <Score>{burnout.score}점</Score>
                  </ResultContent>
                )}
              </>
            ) : (
              <WhiteButtonLink to="/trial/burnout">테스트하러 가기</WhiteButtonLink>
            )}
          </Textbox>
        </TestBox>

        <TestBox>
          <NameBox>
            <TestName>성향 검사</TestName>
            <ExplanationBox>
              <Img src="src/assets/tendency.png" alt="Rectangle" />
              <Explanation>워케이션 전, 성향검사로 나에게 맞는 휴식을 찾아보세요.</Explanation>
            </ExplanationBox>
          </NameBox>
          <Textbox>
            {preference ? (
              <>
                {new Date(preference.update_date) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? (
                  <WhiteButtonLink to="/trial/tendency">
                    <div>성향 검사한지 한달이 지났습니다.</div>재검사를 실시하세요.
                  </WhiteButtonLink>
                ) : (
                  <ResultContent>
                    <Result>{preference.result_content}</Result>
                  </ResultContent>
                )}
              </>
            ) : (
              <WhiteButtonLink to="/trial/tendency">테스트하러 가기</WhiteButtonLink>
            )}
          </Textbox>
        </TestBox>
      </Content>
    </>
  );
};

const Result = styled.div`
  height: 100%;
  overflow: auto;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: left;
`;

const Score = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
  width: 50px;
  height: 30px;
  background: white;
`;

const ResultContent = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Img = styled.img`
  box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.3);
  width: 130px;
  height: 100px;
  object-fit: cover;
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
  position: relative;
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
