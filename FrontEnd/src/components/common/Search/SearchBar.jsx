import React from 'react';
import styled from 'styled-components';
import SearchBtn from '../../../assets/SearchBtn.png';
import btn from '../../../styles/Button';
const SearchBar = () => {
  return (
    <BarWrap>
      <LeftSide>
        <BtnImg src={SearchBtn} />
        <SearchInput type="text" placeholder="워케이션 떠날 장소를 입력하세요" />
      </LeftSide>
      <RightSide>
        <div>|</div>
        <div>캘랜더 자리 06.04.수 ~ 06.06.금 (2박)</div>
      </RightSide>
      <div>
        <RightBtn style={btn.buttonYb}>검색</RightBtn>
      </div>
      <div />
    </BarWrap>
  );
};
const BarWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing.s2};
  border-radius: ${({ theme }) => theme.borderRadius['3xl']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-family: ${({ theme }) => theme.fontFamily.secondary};
  background-color : ${({ theme }) => theme.colors.white};;
`;

const BtnImg = styled.img`
  width: 34px;
  height: 34px;
`;
const SearchInput = styled.input`
  background-color: ${({ theme }) => theme.colors.white};
  width: 80%;
`;

const LeftSide = styled.div`
  width: 100%;
  display: flex;
  gap: ${({ theme }) => theme.spacing.s2};
  align-items: center;
  padding-left: ${({ theme }) => theme.spacing.s5};
`;
const RightSide = styled.div`
  width: 60%;
  display: flex;
  gap: ${({ theme }) => theme.spacing.s2};
`;

const RightBtn = styled.button`
  width: 100px;
  padding: ${({ theme }) => theme.spacing.s2};
  margin-right: ${({ theme }) => theme.spacing.s5};
  color: ${({ theme }) => theme.colors.black};
  font-family: ${({ theme }) => theme.fontFamily.primary};
`;
export default SearchBar;
