import styled from 'styled-components';
import FolderIcon from '../common/Folder';
import DefualtFolderIcon from '../common/DefualtFolder';
import { useState } from 'react';

const RegisterList = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <FormContainer>
      <InputBox isActive={isActive} onClick={() => setIsActive((prev) => !prev)}>
        <DefualtFolderIcon />
        <Label>호스트 신청</Label>
      </InputBox>
      <InputBox>
        <Label>사업자등록번호</Label>
        <Input name="businessNumber" required />
      </InputBox>
      <InputBox>
        <Label>담당자명</Label>
        <Input name="manager" required />
      </InputBox>
      <InputBox>
        <Label>연락처</Label>
        <Input name="phone" required />
      </InputBox>
      <InputBox>
        <Label>이메일</Label>
        <Input name="email" required />
      </InputBox>
      <InputBox>
        <Label>주소</Label>
        <Input name="address" required />
      </InputBox>
      <Button type="submit">등록</Button>
    </FormContainer>
  );
};

export default RegisterList;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 400px;
  background: #fff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const InputBox = styled.div`
  display: flex;
  gap: 9px;
  color: ${({ theme, isActive }) => (isActive ? theme.colors.secondary : theme.colors.black)};
  fill: ${({ theme, isActive }) => (isActive ? theme.colors.secondary : theme.colors.black)};
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 12px;
  background: #ffeb8c;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
`;
