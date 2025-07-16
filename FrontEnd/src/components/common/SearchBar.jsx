import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import SearchBtn from '../../assets/SearchBtn.png';
import btn from '../../styles/Button';
import ReservationCalendar from './ReservationCalendar.jsx';
import { FaRegCalendarAlt } from 'react-icons/fa';
import useSearchStore from '../../store/useSearchStore';
import '../../styles/ReservationCalendar.css'; //캘랜더 전용 CSS
import { useLocation, useNavigate } from 'react-router-dom';
import MyinfoStatus from '../../components/common/MyinfoStatus';

// n박 계산 함수 (컴포넌트 상단에 위치)
const getNightCount = (start, end) => {
  const diff = (end - start) / (1000 * 60 * 60 * 24);
  return diff > 0 ? `${diff}박` : '1박';
};

const SearchBar = ({ onSearch, keyword: externalKeyword, popularKeywords = [] }) => {
  const setDates = useSearchStore((state) => state.setDates);
  const setKeyword = useSearchStore((state) => state.setKeyword);
  const navigate = useNavigate();
  // 날짜 상태
  const [selectedDates, setSelectedDates] = useState([new Date(2025, 6, 1), new Date(2025, 6, 2)]);
  const [tempDates, setTempDates] = useState([new Date(2025, 6, 1), new Date(2025, 6, 2)]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [inputKeyword, setInputKeyword] = useState('');
  const prevNightCount = useRef(getNightCount(new Date(2025, 6, 1), new Date(2025, 6, 2)));
  const location = useLocation();

  // 외부에서 keyword가 바뀌면 input도 같이 초기화
  useEffect(() => {
    if (externalKeyword !== undefined && inputKeyword !== externalKeyword) {
      setInputKeyword(externalKeyword);
    }
  }, [externalKeyword]);

  // inputKeyword가 바뀔 때마다 store에 저장
  useEffect(() => {
    setKeyword(inputKeyword);
  }, [inputKeyword, setKeyword]);

  // '확인' 버튼을 누를 때만 날짜 적용 및 zustand에 반영
  const handleCalendarConfirm = (dates) => {
    setSelectedDates(dates);
    setDates(dates[0], dates[1]);
    setShowCalendar(false);
    prevNightCount.current = getNightCount(dates[0], dates[1]);
  };

  // 날짜 포맷 함수
  const formatDate = (date) => `${date.getFullYear()}년${date.getMonth() + 1}월${date.getDate()}일`;

  // 검색 버튼 클릭 시
  const handleSearch = () => {
    if (onSearch) onSearch(inputKeyword);
    // 검색어를 store에 저장하고 전체 리스트 페이지로 이동
    if (inputKeyword.trim() !== '') {
      setKeyword(inputKeyword);
      navigate('/worcation');
    }
  };

  // selectedDates가 바뀌면 tempDates도 동기화(외부에서 날짜 초기화 시)
  useEffect(() => {
    setTempDates(selectedDates);
  }, [selectedDates]);

  // 추천 검색어 클릭 시 keyword에 반영
  const handleKeywordClick = (word) => {
    setInputKeyword(word);
    if (onSearch) onSearch(word);
    setShowCalendar(false);
    // 추천 검색어를 store에 저장하고 전체 리스트 페이지로 이동
    setKeyword(word);
    navigate('/worcation');
  };

  useEffect(() => {
    setShowCalendar(false);
  }, [location.pathname]);

  return (
    <BackWrap>
      <BarWrap
        onClick={(e) => {
          if (!e.target.closest('button')) setShowCalendar((prev) => !prev);
        }}
        $isActive={showCalendar}
      >
        <LeftSide>
          <BtnImg src={SearchBtn} />
          <SearchInput
            type="text"
            placeholder="워케이션 떠날 장소를 입력하세요"
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
        </LeftSide>
        <RightSideWrap>
          <RightSide>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <FaRegCalendarAlt />
              <DateText>
                {showCalendar
                  ? `${formatDate(tempDates[0])} ~ ${formatDate(tempDates[1])} ${getNightCount(tempDates[0], tempDates[1])}`
                  : `${formatDate(selectedDates[0])} ~ ${formatDate(selectedDates[1])} ${getNightCount(selectedDates[0], selectedDates[1])}`}
              </DateText>
            </div>
          </RightSide>
        </RightSideWrap>
        <ButtonWrap>
          <RightBtn style={btn.buttonYb} onClick={handleSearch}>
            검색
          </RightBtn>
        </ButtonWrap>
      </BarWrap>
      {showCalendar && (
        <BottomRow>
          <BottomLeft>
            <ButtomLeftUl>
              {(popularKeywords || []).slice(0, 5).map((word, idx) => (
                <KeywordItem key={idx} onClick={() => handleKeywordClick(word)}>
                  {word}
                </KeywordItem>
              ))}
            </ButtomLeftUl>
          </BottomLeft>
          <BottomCenter>
            <ReservationCalendar
              selectedDates={tempDates}
              setSelectedDates={setTempDates}
              onConfirm={handleCalendarConfirm}
            />
          </BottomCenter>
        </BottomRow>
      )}
      <MyinfoStatus navigate={navigate} />
    </BackWrap>
  );
};

const BackWrap = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 140px;
  margin-bottom: 40px;
  position: relative;
  flex-direction: row;
  align-items: center;
  gap: 30px;
`;

const BarWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing.s2};
  border-radius: ${({ theme }) => theme.borderRadius['3xl']};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-family: ${({ theme }) => theme.fontFamily.secondary};
  background-color: ${({ theme }) => theme.colors.white};
  max-width: 1280px;
  margin: 0 auto;
  gap: 10;
  transition: all 0.2s ease;
  border: 1px solid ${({ theme }) => theme.colors.primary};

  ${({ $isActive }) =>
    $isActive &&
    `
    border: 1px solid ${({ theme }) => theme.colors.primary};
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    transform: translateY(-72px);
    
  `}
`;

const BtnImg = styled.img`
  width: 34px;
  height: 34px;
`;
const SearchInput = styled.input`
  background-color: ${({ theme }) => theme.colors.white};
  width: 80%;
  color: ${({ theme }) => theme.colors.black};
`;

const LeftSide = styled.div`
  flex: 1;
  display: flex;
  gap: ${({ theme }) => theme.spacing.s2};
  align-items: center;
  padding-left: ${({ theme }) => theme.spacing.s5};
`;
const RightSideWrap = styled.div`
  flex: 1.2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const RightSide = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s2};
  align-items: flex-start;
`;

const RightBtn = styled.button`
  width: 100px;
  padding: ${({ theme }) => theme.spacing.s2};
  margin-right: ${({ theme }) => theme.spacing.s5};
  color: ${({ theme }) => theme.colors.black};
  font-family: ${({ theme }) => theme.fontFamily.primary};
`;

const BottomRow = styled.div`
  max-width: 1280px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['3xl']};
  padding: 10px;
  z-index: 100;
  position: absolute;
  top: 41%;
  left: 0;
  width: 61%;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const BottomLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const ButtomLeftUl = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;
const BottomCenter = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const DateText = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-left: 8px;
`;

const ButtonWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 0.8;
`;

const KeywordItem = styled.li`
  width: 240px;
  background: #fff;
  border-radius: 4px;
  padding: 10px 0 10px 10px;
  margin: 10px 0 8px 20px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  border: 1px solid #5c3b00;
  text-align: left;
`;
export default SearchBar;
