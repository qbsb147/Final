import React, { useState } from 'react';
import { CompanyDropdown, DropdownItem, InputBox, Label, Btn, AddressSearchButton, StyledDatePickerWrapper } from './sharedStyles';
import {
  createHandleChange,
  createHandleCompanyNameKeyUp,
  createHandleCompanySelect,
  createHandleAddressSearch,
} from './Handler';
import styled from 'styled-components';
import Popup from './Popup';
import CustomDatePicker from '../../../components/common/DatePicker';

const HIDDEN_FIELDS = ['address', 'email', 'company_tel'];

const MasterStep = ({
  formData2,
  setFormData2,
  companyNameTimeout,
  setCompanySearchResults,
  memberService,
  companySearchResults,
  isPostcodeReady,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [departments, setDepartments] = useState([]);

  const handleChange = createHandleChange(() => {}, setFormData2);
  const handleCompanyNameKeyUp = createHandleCompanyNameKeyUp(
    companyNameTimeout,
    setCompanySearchResults,
    memberService
  );
  const handleCompanySelect = createHandleCompanySelect(setFormData2, setCompanySearchResults);
  const handleAddressSearch = createHandleAddressSearch(isPostcodeReady, setFormData2);

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
          <div style={{ position: 'relative' }}>
            <InputBox
              name="company_name"
              type="text"
              placeholder="기업명"
              value={formData2.company_name || ''}
              onChange={(e) => handleChange(e, 2)}
              onKeyUp={handleCompanyNameKeyUp}
              autoComplete="off"
              variant="yellow"
            />
            {companySearchResults.length > 0 && (
              <CompanyDropdown>
                {companySearchResults.map((company) => (
                  <DropdownItem key={company.company_no} onClick={() => handleCompanySelect(company)}>
                    {company.company_name}
                  </DropdownItem>
                ))}
              </CompanyDropdown>
            )}
          </div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="business_id">사업자 등록 번호</Label>
          <InputBox
            name="business_id"
            type="text"
            placeholder="숫자만 10자리 입력"
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
              <Label htmlFor="email">이메일</Label>
              <InputBox
                name="email"
                type="text"
                placeholder="이메일"
                value={formData2.email || ''}
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
