import React, { useState } from 'react';
import styled from 'styled-components';
import SearchBtn from '../../assets/SearchBtn.png';
import btn from '../../styles/Button';

const MemberSearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchText.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchText.trim());
    }
  };

  return (
    <BarWrap>
      <LeftSide>
        <SearchWrapper>
          <BtnImg src={SearchBtn} />
          <SearchInput
            type="text"
            placeholder="직원 이름을 입력해주세요"
            value={searchText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </SearchWrapper>
      </LeftSide>
      <RightBtn style={btn.buttonYb} onClick={handleSearchClick}>
        검색
      </RightBtn>
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
  background-color: ${({ theme }) => theme.colors.white};
`;

const BtnImg = styled.img`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  pointer-events: none;
`;
const SearchWrapper = styled.div`
  position: relative;
  width: 90%;
`;
const SearchInput = styled.input`
  background-color: ${({ theme }) => theme.colors.gray[100]};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.s2};
  padding-left: 50px; /* 이미지 너비 + 여백 */
  border-radius: ${({ theme }) => theme.borderRadius['3xl']};
  border: none;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-family: ${({ theme }) => theme.fontFamily.secondary};
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

export default MemberSearchBar;
