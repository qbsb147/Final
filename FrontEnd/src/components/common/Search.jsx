import React from 'react';
import SearchBar from './SearchBar';
import styled from 'styled-components';
import useSearchStore from '../../store/useSearchStore';

const Search = () => {
  const setKeyword = useSearchStore((state) => state.setKeyword);
  const popularKeywords = useSearchStore((state) => state.popularKeywords);
  const keyword = useSearchStore((state) => state.keyword);

  // 페이지가 바뀔 때 검색어를 초기화하지 않음 (검색 결과를 유지하기 위해)
  // React.useEffect(() => {
  //   setKeyword('');
  // }, [location.pathname, setKeyword]);

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
