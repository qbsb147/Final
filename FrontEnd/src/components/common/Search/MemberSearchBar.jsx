import React from 'react'
import styled from 'styled-components';
import btn from '../../../styles/Button';
import SearchBtn from '../../../assets/SearchBtn.png';
const MemberSearchBar = () => {
  return (
    <SearchInner>
    <BarWrap>
      <LeftSide>
        <BtnImg src={SearchBtn} />
        <SearchInput type="text" placeholder="직원이름을 입력해주세요." />
      </LeftSide>
        <RightBtn style={btn.buttonYb}>검색</RightBtn>
      <div />
    </BarWrap>
    </SearchInner>
  );
}
const SearchInner = styled.div`
    max-width : 1280px;
    height : 100%;
    margin: ${({ theme }) => theme.spacing.s0} auto;
    padding: ${({ theme }) => theme.spacing.s4};
    display: flex;
    align-items: center;
    justify-content: flex-end;

`;
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
  background-color : ${({ theme }) => theme.colors.white};
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

const RightBtn = styled.button`
  width: 100px;
  padding: ${({ theme }) => theme.spacing.s2};
  margin-right: ${({ theme }) => theme.spacing.s5};
  color: ${({ theme }) => theme.colors.black};
  font-family: ${({ theme }) => theme.fontFamily.primary};
`;
export default MemberSearchBar
