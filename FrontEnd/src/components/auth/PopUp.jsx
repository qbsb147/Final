import React, { useState } from 'react';
import styled from 'styled-components';
import { ButtonBorder } from '../../styles/Button.styles';

const Popup = ({ handleDeptBtnClick, departments, setDepartments }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleAddDepartment = () => {
    if (inputValue.trim() !== '') {
      setDepartments((prev) => [...prev, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddDepartment();
    }
  };

  const handleRemoveDepartment = (idx) => {
    setDepartments((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <>
      <Top>
        <Button type="button" style={{ width: '150px', whiteSpace: 'nowrap' }} onClick={handleDeptBtnClick}>
          등록 완료
        </Button>
        <InputBox
          variant="yellow"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="부서명을 입력하세요"
        />
        <CirclePlus type="button" onClick={handleAddDepartment}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#22C55E" />
            <rect x="9" y="15" width="14" height="2" rx="1" fill="white" />
            <rect x="15" y="9" width="2" height="14" rx="1" fill="white" />
          </svg>
        </CirclePlus>
      </Top>
      <Content>
        <InBody>
          {departments.map((dept, idx) => (
            <Department key={idx}>
              {dept}
              <MinusButton type="button" onClick={() => handleRemoveDepartment(idx)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="9" width="14" height="2" rx="1" fill="#EF4444" />
                </svg>
              </MinusButton>
            </Department>
          ))}
        </InBody>
      </Content>
    </>
  );
};

export default Popup;

const Top = styled.div`
  display: flex;
  width: 400px;
  gap: 5px;
  align-items: center;
`;

const CirclePlus = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
`;

const Button = styled(ButtonBorder)`
  font-size: 14px;
  height: 50px;
`;

const Content = styled.div`
  background: white;
  border-radius: 10px;
  width: 400px;
  height: 300px;
  border: 1px solid #dda900;
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  gap: 10px;
  overflow-y: auto;
  align-items: flex-start;
`;

const InBody = styled.div`
  width: 400px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const Department = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  height: min-content;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 15px;
`;

const MinusButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-left: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
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
