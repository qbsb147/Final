import React from 'react';
import SearchBar from './SearchBar';
import styled from 'styled-components';
import MyinfoStatus from './MyinfoStatus';
import { useLocation } from 'react-router-dom';
import useWorcationStore from '../../store/worcationStore';

const Search = () => {
  const location = useLocation();
  const setKeyword = useWorcationStore((state) => state.setKeyword);
  const popularKeywords = useWorcationStore((state) => state.popularKeywords);
  const keyword = useWorcationStore((state) => state.keyword);

  React.useEffect(() => {
    setKeyword('');
  }, [location.pathname, setKeyword]);

  return (
    <SearchWrap>
      <SearchBg>
        <SearchInner>
          <SearchBar
            onSearch={setKeyword}
            keyword={keyword}
            popularKeywords={popularKeywords}
            rightComponent={<MyinfoStatus />}
          />
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
