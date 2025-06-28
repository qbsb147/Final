import React from 'react';
import styled from 'styled-components';

const EmployeeStep = ({
  formData2,
  setFormData2,
  companyNameTimeout,
  setCompanySearchResults,
  memberService,
  companySearchResults,
}) => {
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

  const handleDepartmentSelect = () => {
    // 부서 선택 로직
  };

  const handlePositionSelect = () => {
    // 직급 선택 로직
  };

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
            onClick={handleDepartmentSelect}
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
            onClick={handlePositionSelect}
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

const Label = styled.label`
  display: block;
  text-align: left;
  margin-bottom: ${({ theme }) => theme.spacing.s2};
  margin-left: ${({ theme }) => theme.spacing.s1};
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
