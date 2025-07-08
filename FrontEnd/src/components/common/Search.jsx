import React from 'react';
import SearchBar from './SearchBar';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import useSearchStore from '../../store/useSearchStore';

const Search = () => {
  const location = useLocation();
  const setKeyword = useSearchStore((state) => state.setKeyword);
  const popularKeywords = useSearchStore((state) => state.popularKeywords);
  const keyword = useSearchStore((state) => state.keyword);

  React.useEffect(() => {
    setKeyword('');
  }, [location.pathname, setKeyword]);

  return (
    <SearchWrap>
      <SearchBg>
        <SearchInner>
          <SearchBar onSearch={setKeyword} keyword={keyword} popularKeywords={popularKeywords} />
        </SearchInner>
      </SearchBg>
    </SearchWrap>
  );
};

const SearchWrap = styled.div``;
const SearchBg = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[100]};
  background-position: center;
  width: 100%;
`;

const SearchInner = styled.div`
  max-width: 1280px;
  height: 100%;
  margin: ${({ theme }) => theme.spacing.s0} auto;
  padding: ${({ theme }) => theme.spacing.s0} ${({ theme }) => theme.spacing.s4};
  display: flex;
  align-items: center;
  justify-content: space-around;
`;
export default Search;
