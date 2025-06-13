import React from 'react';
import styled from 'styled-components';

const MemberList = () => {
  return (
    <MemberListWrap>
      <LeftWrap>왼쪽20%</LeftWrap>
      <CenterWrap>
        중앙80%
        <BottomWrap>중앙아래80%</BottomWrap>
      </CenterWrap>
    </MemberListWrap>
  );
};

const MemberListWrap = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
`;

const LeftWrap = styled.div`
  width: 20%;
  height: 100%;
  background-color: #f83232;
`;
const CenterWrap = styled.div`
  width: 80%;
  height: 100%;
  background-color: #82ffc1;
`;
const BottomWrap = styled.div`
  width: 100%;
  height: 100%;
  background-color: #459992;
`;
export default MemberList;
