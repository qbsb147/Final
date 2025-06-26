import React from 'react';
import { CompanyDropdown, DropdownItem, InputBox, Label } from './sharedStyles';
import { createHandleChange, createHandleCompanyNameKeyUp, createHandleCompanySelect } from './Handler';
import styled from 'styled-components';

const EmployeeStep = ({
  formData2,
  setFormData2,
  companyNameTimeout,
  setCompanySearchResults,
  memberService,
  companySearchResults,
}) => {
  const handleChange = createHandleChange(() => {}, setFormData2);
  const handleCompanyNameKeyUp = createHandleCompanyNameKeyUp(
    companyNameTimeout,
    setCompanySearchResults,
    memberService
  );
  const handleCompanySelect = createHandleCompanySelect(setFormData2, setCompanySearchResults);

  return (
    <Body className="InputWrap">
      {/* 왼쪽 컬럼 */}
      <Left>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="company_name">회사명</Label>
          <div style={{ position: 'relative' }}>
            <InputBox
              name="company_name"
              type="text"
              placeholder="회사명"
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
          <Label htmlFor="department">부서명</Label>
          <InputBox
            name="department"
            type="text"
            placeholder="부서명"
            value={formData2.department || ''}
            onChange={(e) => handleChange(e, 2)}
            variant="yellow"
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="position">직급</Label>
          <InputBox
            name="position"
            type="text"
            placeholder="직급"
            value={formData2.position || ''}
            onChange={(e) => handleChange(e, 2)}
            variant="yellow"
          />
        </div>
      </Left>
      {/* 오른쪽 컬럼 */}
      <Right>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="company_address">회사주소</Label>
          <InputBox
            name="company_address"
            type="text"
            placeholder="회사주소"
            value={formData2.company_address || ''}
            onChange={(e) => handleChange(e, 2)}
            variant="yellow"
            readOnly
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="company_email">회사 이메일</Label>
          <InputBox
            name="company_email"
            type="text"
            placeholder="회사 이메일"
            value={formData2.company_email || ''}
            onChange={(e) => handleChange(e, 2)}
            variant="yellow"
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="company_phone">회사 전화번호</Label>
          <InputBox
            name="company_phone"
            type="text"
            placeholder="회사 전화번호"
            value={formData2.company_phone || ''}
            onChange={(e) => handleChange(e, 2)}
            variant="yellow"
          />
        </div>
      </Right>
    </Body>
  );
};

export default EmployeeStep;

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
