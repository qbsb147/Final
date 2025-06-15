import styled from 'styled-components';
import FolderIcon from './Folder';
import { useState } from 'react';

const List = () => {
  const [selectedMenu, setSelectedMenu] = useState('');

  const menuItems = [
    { id: 'application', label: '호스트 신청' },
    { id: 'company', label: '업체 정보' },
    { id: 'info', label: '소개' },
    { id: 'photo', label: '사진' },
    { id: 'facility', label: '편의시설' },
    { id: 'location', label: '위치/주소' },
    { id: 'policy', label: '운영 정책' }
  ];

  return (
    <>
      <Body>
        <Top>워케이션 관리</Top>
        <FormContainer>
          {menuItems.map((item) => (
            <InputBox
              key={item.id}
              isActive={selectedMenu === item.id}
              onClick={() => setSelectedMenu(item.id)}
            >
              <FolderIcon />
              <Label>{item.label}</Label>
            </InputBox>
          ))}
        </FormContainer>
      </Body>
    </>
  );
};

export default List;

const Body = styled.div``;

const Top = styled.div`
  display: flex;
  width: 256px;
  height: 50px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white};
  border-left: 2px solid ${({ theme }) => theme.colors.gray[200]};
  border-right: 2px solid ${({ theme }) => theme.colors.gray[200]};
  border-top: 2px solid ${({ theme }) => theme.colors.gray[200]};
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 256px;
  height: 562px;
  background: #fff;
  padding: 40px;
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
`;

const InputBox = styled.div`
  display: flex;
  gap: 9px;
  color: ${({ theme, isActive }) => (isActive ? theme.colors.secondary : theme.colors.black)};
`;

const Label = styled.label`
  font-weight: bold;
`;
