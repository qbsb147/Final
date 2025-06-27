import React from 'react';
import { RadioGroup, Label, InputBox, AddressSearchButton, StyledDatePickerWrapper } from './sharedStyles';
import CustomDatePicker from '../../../components/common/DatePicker';
import { createHandleChange, createHandleRadioChange, createHandleAddressSearch } from './Handler';
import styled from 'styled-components';

const DefaultStep = ({ formData1, setFormData1, setSelectedRole, setFormData2, isPostcodeReady }) => {
  const handleChange = createHandleChange(setFormData1, () => {});
  const handleRadioChange = createHandleRadioChange(setSelectedRole, setFormData1, setFormData2);
  const handleAddressSearch = createHandleAddressSearch(isPostcodeReady, setFormData1);

  return (
    <Body className="InputWrap">
      {/* 왼쪽 컬럼 */}
      <Left>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="user_id">아이디</Label>
          <InputBox
            name="user_id"
            type="text"
            placeholder="아이디"
            value={formData1.user_id || ''}
            onChange={(e) => handleChange(e, 1)}
            variant="yellow"
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="user_pwd">비밀번호</Label>
          <InputBox
            name="user_pwd"
            type="password"
            placeholder="비밀번호"
            value={formData1.user_pwd || ''}
            onChange={(e) => handleChange(e, 1)}
            variant="yellow"
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="user_pwd_check">비밀번호 확인</Label>
          <InputBox
            name="user_pwd_check"
            type="password"
            placeholder="비밀번호 확인"
            value={formData1.user_pwd_check || ''}
            onChange={(e) => handleChange(e, 1)}
            variant="yellow"
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="name">이름</Label>
          <InputBox
            name="name"
            type="text"
            placeholder="이름"
            value={formData1.name || ''}
            onChange={(e) => handleChange(e, 1)}
            variant="yellow"
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Label>성별</Label>
          <RadioGroup>
            <input
              type="radio"
              name="gender"
              value="M"
              checked={formData1.gender === 'M'}
              onChange={(e) => handleChange(e, 1)}
            />{' '}
            남성
            <input
              type="radio"
              name="gender"
              value="W"
              checked={formData1.gender === 'W'}
              onChange={(e) => handleChange(e, 1)}
            />{' '}
            여성
          </RadioGroup>
        </div>
      </Left>
      {/* 오른쪽 컬럼 */}
      <Right>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="address">주소</Label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '400px' }}>
            <InputBox
              name="address"
              type="text"
              value={formData1.address || ''}
              readOnly
              placeholder="주소"
              variant="yellow"
            />
            <AddressSearchButton type="button" onClick={handleAddressSearch} disabled={!isPostcodeReady}>
              검색
            </AddressSearchButton>
          </div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="birthday">생년월일</Label>
          <StyledDatePickerWrapper>
            <CustomDatePicker
              selected={formData1.birthday || null}
              onChange={(date) => handleChange({ target: { name: 'birthday', value: date } }, 1)}
            />
          </StyledDatePickerWrapper>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="email">이메일</Label>
          <InputBox
            name="email"
            type="text"
            placeholder="이메일"
            value={formData1.email || ''}
            onChange={(e) => handleChange(e, 1)}
            variant="yellow"
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Label htmlFor="phone">연락처</Label>
          <InputBox
            name="phone"
            type="text"
            placeholder="연락처"
            value={formData1.phone || ''}
            onChange={(e) => handleChange(e, 1)}
            variant="yellow"
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Label>회원 유형</Label>
          <RadioGroup>
            <input
              type="radio"
              name="role"
              value="employee"
              checked={formData1.role === 'employee'}
              onChange={handleRadioChange}
            />
            직원
            <input
              type="radio"
              name="role"
              value="master"
              checked={formData1.role === 'master'}
              onChange={handleRadioChange}
            />
            기업
            <input
              type="radio"
              name="role"
              value="worcation"
              checked={formData1.role === 'worcation'}
              onChange={handleRadioChange}
            />
            워케이션 업체
          </RadioGroup>
        </div>
      </Right>
    </Body>
  );
};

export default DefaultStep;

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
