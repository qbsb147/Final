import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Popup from './Popup';
import CustomDatePicker from '../common/DatePicker';
import memberService from '../../api/members';

const HIDDEN_FIELDS = ['address', 'email', 'company_tel'];

const MasterStep = ({ setFormData1, formData2, setFormData2 }) => {
  const [showInput, setShowInput] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [companySearchResults, setCompanySearchResults] = useState([]);
  const [isPostcodeReady, setIsPostcodeReady] = useState(false);
  const companyNameTimeout = useRef();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    script.onload = () => setIsPostcodeReady(true);
    script.onerror = () => console.error('주소 검색 스크립트 로드 실패');
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleChange = (e, step) => {
    const { name, value } = e.target;
    if (step === 1) setFormData1((prev) => ({ ...prev, [name]: value }));
    else if (step === 2) setFormData2((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompanyNameKeyUp = (e) => {
    const value = e.target.value;
    if (companyNameTimeout.current) clearTimeout(companyNameTimeout.current);
    companyNameTimeout.current = setTimeout(async () => {
      if (!value) {
        setCompanySearchResults([]);
        return;
      }
      try {
        const data = await memberService.searchCompany(value);
        setCompanySearchResults(Array.isArray(data) ? data : []);
      } catch (err) {
        setCompanySearchResults([]);
        console.error('회사명 검색 에러:', err);
      }
    }, 500);
  };

  const handleCompanySelect = (company) => {
    setFormData2((prev) => ({
      ...prev,
      worcation_no: company.company_no,
      company_address: company.company_address,
    }));
    setCompanySearchResults([]);
  };

  const handleAddressSearch = () => {
    if (!isPostcodeReady) {
      alert('주소 검색 스크립트가 아직 준비되지 않았습니다.');
      return;
    }
    new window.daum.Postcode({
      oncomplete: function (data) {
        const addr = data.address;
        setFormData2((prev) => ({ ...prev, address: addr }));
      },
    }).open();
  };

  const handleDeptBtnClick = () => {
    if (showInput) {
      setFormData2((prev) => ({ ...prev, department: departments }));
    }
    setShowInput(!showInput);
  };

  return (
    <Body className="InputWrap">
      {/* Left column */}
      <Left>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="company_name">기업명</Label>
          <InputBox
            name="company_name"
            type="text"
            placeholder="기업명"
            value={formData2.company_name || ''}
            onChange={(e) => handleChange(e, 2)}
            autoComplete="off"
            variant="yellow"
            onKeyUp={handleCompanyNameKeyUp}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="business_id">사업자 등록 번호</Label>
          <InputBox
            name="business_id"
            type="text"
            placeholder="숫자 10자리 입력"
            value={formData2.business_id || ''}
            onChange={(e) => handleChange(e, 2)}
            variant="yellow"
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="licensee">사업자명</Label>
          <InputBox
            name="licensee"
            type="text"
            placeholder="사업자명"
            value={formData2.licensee || ''}
            onChange={(e) => handleChange(e, 2)}
            variant="yellow"
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="open_date">개업일</Label>
          <StyledDatePickerWrapper>
            <CustomDatePicker
              selected={formData2.open_date || null}
              onChange={(date) => handleChange({ target: { name: 'open_date', value: date } }, 2)}
            />
          </StyledDatePickerWrapper>
        </div>
      </Left>
      {/* Right column */}
      <Right>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="register_department">부서 등록</Label>
          {showInput ? (
            <>
              <Popup
                handleDeptBtnClick={handleDeptBtnClick}
                departments={departments}
                setDepartments={setDepartments}
              />
            </>
          ) : (
            <Btn type="button" style={{ width: '100%' }} onClick={handleDeptBtnClick}>
              부서 등록
            </Btn>
          )}
        </div>
        {showInput ? (
          <></>
        ) : (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Label htmlFor="company_address">기업주소</Label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '400px' }}>
                <InputBox
                  name="company_address"
                  type="text"
                  placeholder="기업주소"
                  value={formData2.address || ''}
                  readOnly
                  variant="yellow"
                />
                <AddressSearchButton type="button" onClick={handleAddressSearch} disabled={!isPostcodeReady}>
                  검색
                </AddressSearchButton>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <Label htmlFor="business_email">이메일</Label>
              <InputBox
                name="business_email"
                type="text"
                placeholder="이메일"
                value={formData2.business_email || ''}
                onChange={(e) => handleChange(e, 2)}
                variant="yellow"
                readOnly={showInput}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <Label htmlFor="company_tel">기업전화번호</Label>
              <InputBox
                name="company_tel"
                type="text"
                placeholder="기업전화번호"
                value={formData2.company_tel || ''}
                onChange={(e) => handleChange(e, 2)}
                variant="yellow"
                readOnly={showInput}
              />
            </div>
          </div>
        )}
      </Right>
    </Body>
  );
};

export default MasterStep;

const Body = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 100px;
  align-items: stretch;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const InputBox = styled.input`
  ${({ variant }) => {
    switch (variant) {
      case 'yellow':
        return `
          background: #ffffff;
          border: 3px solid #ffeb8c;
          border-radius: 10px;
          color: black;
        `;
      case 'gray':
        return `
          background: #f3f3f3;
          border: 3px solid #d1d5db;
          border-radius: 10px;
          color: black;
        `;
      case 'orange':
        return `
          background: #ffffff;
          border: 3px solid #f59e0b;
          border-radius: 10px;
          color: black;
        `;
      default:
        return '';
    }
  }};
  width: 400px;
  padding: ${({ theme }) => theme.spacing.s3};
  box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.25);
  margin: ${({ theme }) => theme.spacing.s0};
`;

const Btn = styled.button`
  width: 100px;
  height: 52.41px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.black};
  border: none;
`;

const Label = styled.label`
  display: block;
  text-align: left;
  margin-bottom: ${({ theme }) => theme.spacing.s2};
  margin-left: ${({ theme }) => theme.spacing.s1};
`;

const StyledDatePickerWrapper = styled.div`
  .react-datepicker__input-container input {
    box-sizing: border-box;
    max-width: 100%;
    width: 400px;
    height: 52.41px;
    background: #ffffff;
    border: 3px solid #ffeb8c;
    border-radius: 10px;
    color: black;
    padding: 0 12px;
    font-size: ${({ theme }) => theme.fontSizes.base};
    outline: none;
    margin: 0;
    box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.25);
  }
  .react-datepicker__input-container input::placeholder {
    color: #adadad;
    opacity: 1;
  }
  .react-datepicker__input-container input:focus {
    border-color: #ffeb8c;
    background: #fff;
  }
`;

const CompanyDropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #fffbe6;
  border: 1px solid #ffeb8c;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 10;
  max-height: 220px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const DropdownItem = styled.li`
  padding: 10px 16px;
  height: 44px;
  cursor: pointer;
  &:hover {
    background: #fff3b0;
  }
`;

const AddressSearchButton = styled.button`
  height: 52.41px;
  min-width: 80px;
  padding: 0 12px;
  background: #feffe0;
  border: 3px solid #dda900;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-family: ${({ theme }) => theme.fontFamily.primary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.black};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
