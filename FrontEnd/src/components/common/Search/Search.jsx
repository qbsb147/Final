import React from 'react'
import SearchBar from './SearchBar'
import styled from 'styled-components'
import MyinfoStatus from './MyinfoStatus'
import { useLocation } from 'react-router-dom'

const Search = () => {
    const location = useLocation();
    const isHomePage = location.pathname ==='/';

  return (
    <SearchWrap>
    <SearchBg>
        <SearchInner>
            <SearchBar />
            {isHomePage && <MyinfoStatus/>}
        </SearchInner>
    </SearchBg>
    </SearchWrap>
  )
}

const SearchWrap = styled.div`
    position: relative;
`;
const SearchBg = styled.div`
    background-color: ${({ theme }) => theme.colors.gray[100]};
    background-position: center;
    width : 100%;
    height : 200px;
    position: relative;
`;

const SearchInner = styled.div`
    max-width : 1280px;
    height : 100%;
    margin: ${({ theme }) => theme.spacing.s0} auto;
    padding: ${({ theme }) => theme.spacing.s0} ${({ theme }) => theme.spacing.s4};
    display: flex;
    align-items: center;
    justify-content: space-around;

`;
export default Search
