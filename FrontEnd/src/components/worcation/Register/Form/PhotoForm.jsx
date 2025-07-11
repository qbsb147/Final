import React, { forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import AddButton from '../../../common/AddButton';
import ImageUploader from '../../../common/ImageUploader';
import useWorcationStore from '../../../../store/useWorcationStore';
import { worcationService } from '../../../../api/worcations';

// 개발 환경에서 mock URL 반환
async function uploadImageWithMock(file) {
  if (import.meta.env.MODE === 'development') {
    // 실제 업로드 없이 가짜 URL 반환
    return 'https://via.placeholder.com/300x200?text=Mock+Image';
  }
  // 운영 환경: 실제 S3 업로드
  return worcationService.uploadImage(file);
}

const PhotoForm = forwardRef((props, ref) => {
  const photos = useWorcationStore((state) => state.photos);
  const setPhotos = useWorcationStore((state) => state.setPhotos);

  useImperativeHandle(ref, () => ({})); // 필요시 getValues 등 추가 가능

  const officePhotos = photos.officePhotos || [];
  const stayPhotos = photos.stayPhotos || [];

  const handleAddOfficePhoto = () => {
    if (officePhotos.length >= 4) return;
    setPhotos({ officePhotos: [...officePhotos, null] });
  };

  const handleAddStayPhoto = () => {
    if (stayPhotos.length >= 4) return;
    setPhotos({ stayPhotos: [...stayPhotos, null] });
  };

  const handleOfficeChange = async (file, index) => {
    try {
      const imageUrl = await uploadImageWithMock(file);
      const newList = [...officePhotos];
      newList[index] = imageUrl;
      setPhotos({ officePhotos: newList });
    } catch {
      alert('오피스 이미지 업로드 실패');
    }
  };

  const handleStayChange = async (file, index) => {
    try {
      const imageUrl = await uploadImageWithMock(file);
      const newList = [...stayPhotos];
      newList[index] = imageUrl;
      setPhotos({ stayPhotos: newList });
    } catch {
      alert('숙소 이미지 업로드 실패');
    }
  };

  const handleOfficeDelete = (index) => {
    const newList = [...officePhotos];
    newList.splice(index, 1);
    setPhotos({ officePhotos: newList });
  };

  const handleStayDelete = (index) => {
    const newList = [...stayPhotos];
    newList.splice(index, 1);
    setPhotos({ stayPhotos: newList });
  };

  return (
    <Body>
      <Title>사진을 추가해주세요.(각 최대 4개)</Title>
      <Table>
        <TBody>
          <TR>
            <TH>오피스 사진</TH>
            <TD>
              {officePhotos.map((_, i) => (
                <ImageUploader
                  key={i}
                  label={i === 0 ? '메인 사진' : '추가 사진'}
                  onChange={(file) => handleOfficeChange(file, i)}
                  onDelete={() => handleOfficeDelete(i)}
                />
              ))}
              {officePhotos.length < 4 && (
                <AddContainer onClick={handleAddOfficePhoto}>
                  <AddButton />
                  <p>사진 추가</p>
                </AddContainer>
              )}
            </TD>
          </TR>
          <TR>
            <TH>숙소 사진</TH>
            <TD>
              {stayPhotos.map((_, i) => (
                <ImageUploader
                  key={i}
                  label={i === 0 ? '메인 사진' : '추가 사진'}
                  onChange={(file) => handleStayChange(file, i)}
                  onDelete={() => handleStayDelete(i)}
                />
              ))}
              {stayPhotos.length < 4 && (
                <AddContainer onClick={handleAddStayPhoto}>
                  <AddButton />
                  <p>사진 추가</p>
                </AddContainer>
              )}
            </TD>
          </TR>
        </TBody>
      </Table>
    </Body>
  );
});

export default PhotoForm;

const AddContainer = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  p {
    color: ${({ theme }) => theme.colors.gray[500]};
  }
  cursor: pointer;
`;

const Body = styled.div`
  gap: 40px;
  padding: 40px;
  height: 562px;
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
`;

const Title = styled.div`
  text-align: start;
`;

const Table = styled.table`
  width: 100%;
  border-spacing: 16px 12px;
`;
const TBody = styled.tbody`
  display: flex;
  flex-direction: column;
  gap: 42px;
`;

const TR = styled.tr`
  vertical-align: middle;
  display: flex;
  align-items: center;
`;

const TH = styled.th`
  text-align: left;
  vertical-align: middle;
  width: 200px;
  font-weight: 500;
  margin-bottom: 40px;
`;

const TD = styled.td`
  display: flex;
  gap: 30px;
  align-items: flex-start;
`;
