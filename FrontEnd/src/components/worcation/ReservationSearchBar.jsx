import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SearchBtn from '../../assets/SearchBtn.png';
import btn from '../../styles/Button';
import { worcationService } from '../../api/worcations';
import Select from 'react-select';
import useAuthStore from '../../store/authStore';

const ReservationSearchBar = ({ onSearch }) => {
  const [worcationList, setWorcationList] = useState([]);
  const [selectedWorcation, setSelectedWorcation] = useState(null);
  const { loginUser } = useAuthStore();

  useEffect(() => {
    if (!loginUser?.user_no) return;

    const fetchWorcations = async () => {
      try {
        const data = await worcationService.WorcationName(loginUser.user_no);
        const formatted = data.map((w) => ({
          value: w.worcation_name,
          label: w.worcation_name,
        }));
        setWorcationList(formatted);
      } catch (error) {
        console.error('워케이션 목록 불러오기 실패:', error);
      }
    };

    fetchWorcations();
  }, [loginUser?.user_no]);

  const handleSearchClick = () => {
    if (onSearch && selectedWorcation) {
      onSearch(selectedWorcation.value);
    }
  };

  return (
    <BarWrap>
      <LeftSide>
        <SearchWrapper>
          <BtnImg src={SearchBtn} />
          <CustomSelect
            options={worcationList}
            value={selectedWorcation}
            onChange={setSelectedWorcation}
            placeholder="업체를 선택해주세요"
            styles={customStyles}
            isSearchable={false}
            menuPlacement="auto"
            noOptionsMessage={() => '등록된 업체가 없습니다'}
          />
        </SearchWrapper>
      </LeftSide>
      <RightBtn style={btn.buttonYb} onClick={handleSearchClick}>
        검색
      </RightBtn>
    </BarWrap>
  );
};

const customStyles = {
  control: (base) => ({
    ...base,
    borderRadius: '1.5rem',
    paddingLeft: '40px',
    backgroundColor: '#f3f3f3',
    border: '1px solid #ccc',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    boxShadow: 'none',
    minHeight: '40px',
    cursor: 'pointer',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '1rem',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    maxHeight: '200px',
    overflowY: 'auto',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#999',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#333',
  }),
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

const CustomSelect = styled(Select)`
  width: 100%;
`;

export default ReservationSearchBar;
