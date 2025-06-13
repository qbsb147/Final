import styled from 'styled-components';
import FolderIcon from '../common/Folder';
import { useState } from 'react';

const RegisterList = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <FormContainer>
      <InputBox isActive={isActive} onClick={() => setIsActive((prev) => !prev)}>
        <FolderIcon />
        <Label>테스트 신청</Label>
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
