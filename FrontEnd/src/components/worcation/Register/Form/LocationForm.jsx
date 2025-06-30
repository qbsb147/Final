import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InputLightGray } from '../../../../styles/Input.styles';
import { ButtonBorder } from '../../../../styles/Button.styles.js';
import CustomTextArea from '../../../common/TextArea';

const Form = () => {
  const [address, setAddress] = useState('');
  const [isPostcodeReady, setIsPostcodeReady] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    script.onload = () => setIsPostcodeReady(true);
    script.onerror = () => console.error('주소 검색 스크립트 로드 실패');
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleSearch = () => {
    if (!isPostcodeReady) {
      alert('주소 검색 스크립트가 아직 준비되지 않았습니다.');
      return;
    }
    new window.daum.Postcode({
      oncomplete: function (data) {
        const addr = data.address;
        setAddress(addr);
      },
    }).open();
  };

  return (
    <Body>
      <Title>위치 / 주소를 입력해주세요.</Title>
      <Table>
        <TBody>
          <TR>
            <TH>주소</TH>
            <TD>
              <InputLightGray type="text" value={address} readOnly placeholder="주소" />
              <ButtonBorder type="button" onClick={handleSearch} disabled={!isPostcodeReady}>
                주소 검색
              </ButtonBorder>
            </TD>
          </TR>
          <TR>
            <TH>길 안내</TH>
            <TD>
              <CustomTextArea rows={13}></CustomTextArea>
            </TD>
          </TR>
        </TBody>
      </Table>
    </Body>
  );
};

export default Form;

const Body = styled.div`
  gap: 40px;
  padding: 40px;
  height: 562px;
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
`;

const Title = styled.div`
  text-align: start;
`;

const Table = styled.table`
  width: 100%;
  border-spacing: 16px 12px;
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
  gap: 20px;
`;
