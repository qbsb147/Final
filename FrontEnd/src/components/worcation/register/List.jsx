import styled from 'styled-components';
import FolderIcon from './Folder';
import { useEffect, useState } from 'react';

const List = () => {
  const [isApplication, setIsApplication] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [isInfo, setIsInfo] = useState(false);
  const [isPhoto, setIsPhoto] = useState(false);
  const [isFacility, setIsFacility] = useState(false);
  const [isLocation, setIsLocation] = useState(false);
  const [isPolicy, setIsPolicy] = useState(false);

  const resetAll = () => {
    setIsApplication(false);
    setIsCompany(false);
    setIsInfo(false);
    setIsPhoto(false);
    setIsFacility(false);
    setIsLocation(false);
    setIsPolicy(false);
  };

  useEffect(() => {
    const selected = isApplication || isCompany || isInfo || isPhoto || isFacility || isLocation || isPolicy;
  }, [isApplication, isCompany, isInfo, isPhoto, isFacility, isLocation, isPolicy]);
  return (
    <>
      <Body>
        <Top>워케이션 관리</Top>
        <FormContainer>
          <InputBox
            isActive={isApplication}
            onClick={() => {
              resetAll();
              setIsApplication(true);
            }}
          >
            <FolderIcon />
            <Label>호스트 신청</Label>
          </InputBox>

          <InputBox
            isActive={isCompany}
            onClick={() => {
              resetAll();
              setIsCompany(true);
            }}
          >
            <FolderIcon />
            <Label>업체 정보</Label>
          </InputBox>

          <InputBox
            isActive={isInfo}
            onClick={() => {
              resetAll();
              setIsInfo(true);
            }}
          >
            <FolderIcon />
            <Label>소개</Label>
          </InputBox>

          <InputBox
            isActive={isPhoto}
            onClick={() => {
              resetAll();
              setIsPhoto(true);
            }}
          >
            <FolderIcon />
            <Label>사진</Label>
          </InputBox>

          <InputBox
            isActive={isFacility}
            onClick={() => {
              resetAll();
              setIsFacility(true);
            }}
          >
            <FolderIcon />
            <Label>편의시설</Label>
          </InputBox>

          <InputBox
            isActive={isLocation}
            onClick={() => {
              resetAll();
              setIsLocation(true);
            }}
          >
            <FolderIcon />
            <Label>위치/주소</Label>
          </InputBox>

          <InputBox
            isActive={isPolicy}
            onClick={() => {
              resetAll();
              setIsPolicy(true);
            }}
          >
            <FolderIcon />
            <Label>운영 정책</Label>
          </InputBox>
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
