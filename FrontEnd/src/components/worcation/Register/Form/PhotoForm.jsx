import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import styled from 'styled-components';
import AddButton from '../../../common/AddButton';
import ImageUploader from '../../../common/ImageUploader';
import useWorcationStore from '../../../../store/useWorcationStore';
import { worcationService } from '../../../../api/worcations';

const CLOUDFRONT_DOMAIN = import.meta.env.VITE_CLOUDFRONT_DOMAIN;

const PhotoForm = forwardRef((props, ref) => {
  const photos = useWorcationStore((state) => state.photos);
  const setPhotos = useWorcationStore((state) => state.setPhotos);

  // 컴포넌트 내부에서만 사용할 preview URL들을 관리
  const [previewUrls, setPreviewUrls] = useState({
    office: {},
    stay: {},
  });

  useImperativeHandle(ref, () => ({
    validatePhotos: (companyType) => {
      // store에서 사진 배열 가져오기
      const photos = useWorcationStore.getState().photos;
      if (companyType === 'Office') {
        return Array.isArray(photos.officePhotos) && photos.officePhotos.length > 0;
      }
      if (companyType === 'Accommodation') {
        return Array.isArray(photos.stayPhotos) && photos.stayPhotos.length > 0;
      }
      if (companyType === 'OfficeAndStay') {
        return (
          Array.isArray(photos.officePhotos) &&
          photos.officePhotos.length > 0 &&
          Array.isArray(photos.stayPhotos) &&
          photos.stayPhotos.length > 0
        );
      }
      return false;
    },
  }));

  // store의 값을 그대로 사용 (초기화 제거)
  const officePhotos = photos?.officePhotos || [];
  const stayPhotos = photos?.stayPhotos || [];

  // 컴포넌트 마운트 시 File 객체로부터 preview URL 생성
  useEffect(() => {
    const generatePreviewUrls = () => {
      const newPreviewUrls = { office: {}, stay: {} };

      // 오피스 사진 preview URL 생성
      officePhotos.forEach((photo, index) => {
        if (photo?.file && (photo.file instanceof File || photo.file instanceof Blob) && !previewUrls.office[index]) {
          newPreviewUrls.office[index] = URL.createObjectURL(photo.file);
        } else if (photo?.url && typeof photo.url === 'string' && !previewUrls.office[index]) {
          // 기존 업로드된 이미지 URL 처리
          newPreviewUrls.office[index] = photo.url;
        }
      });

      // 숙소 사진 preview URL 생성
      stayPhotos.forEach((photo, index) => {
        if (photo?.file && (photo.file instanceof File || photo.file instanceof Blob) && !previewUrls.stay[index]) {
          newPreviewUrls.stay[index] = URL.createObjectURL(photo.file);
        } else if (photo?.url && typeof photo.url === 'string' && !previewUrls.stay[index]) {
          // 기존 업로드된 이미지 URL 처리
          newPreviewUrls.stay[index] = photo.url;
        }
      });

      setPreviewUrls((prev) => ({
        office: { ...prev.office, ...newPreviewUrls.office },
        stay: { ...prev.stay, ...newPreviewUrls.stay },
      }));
    };

    generatePreviewUrls();
  }, [officePhotos, stayPhotos]);

  // 컴포넌트 언마운트 시 모든 blob URL 정리
  useEffect(() => {
    return () => {
      Object.values(previewUrls.office).forEach((url) => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      Object.values(previewUrls.stay).forEach((url) => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const handleAddOfficePhoto = () => {
    if (officePhotos.length >= 4) return;
    setPhotos({
      ...photos,
      officePhotos: [...officePhotos, null],
    });
  };

  const handleAddStayPhoto = () => {
    if (stayPhotos.length >= 4) return;
    setPhotos({
      ...photos,
      stayPhotos: [...stayPhotos, null],
    });
  };

  const handleOfficeChange = async (file, index) => {
    try {
      // 기존 이미지가 있으면 S3에서 삭제 (실패해도 계속 진행)
      const existingPhoto = officePhotos[index];
      if (existingPhoto && existingPhoto.url && typeof existingPhoto.url === 'string') {
        try {
          await worcationService.deleteImage(existingPhoto.url);
          console.log('기존 이미지 삭제 성공:', existingPhoto.url);
        } catch (deleteError) {
          console.warn('기존 이미지 삭제 실패 (계속 진행):', deleteError.message);
          // 삭제 실패해도 계속 진행
        }
      }

      // 기존 preview URL 정리
      if (previewUrls.office[index] && previewUrls.office[index].startsWith('blob:')) {
        URL.revokeObjectURL(previewUrls.office[index]);
      }

      // 새로운 preview URL 생성
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrls((prev) => ({
        ...prev,
        office: { ...prev.office, [index]: newPreviewUrl },
      }));

      // 즉시 S3에 업로드 (기존 이미지 덮어쓰기)
      const imageUrl = await worcationService.uploadImage(file, 'images');
      console.log('업로드된 이미지 URL:', imageUrl);

      // 업로드된 URL과 함께 스토어에 저장
      const newList = [...officePhotos];
      newList[index] = {
        file: file,
        url: imageUrl,
        uploaded: true,
      };
      setPhotos({
        ...photos,
        officePhotos: newList,
      });
    } catch (error) {
      console.error('오피스 이미지 처리 실패:', error);
      alert('오피스 이미지 처리 실패');
    }
  };

  const handleStayChange = async (file, index) => {
    try {
      // 기존 이미지가 있으면 S3에서 삭제
      const existingPhoto = officePhotos[index];
      if (
        existingPhoto &&
        existingPhoto.uploaded === true &&
        typeof existingPhoto.url === 'string' &&
        existingPhoto.url.trim() !== ''
      ) {
        try {
          await worcationService.deleteImage(existingPhoto.url);
          console.log('기존 이미지 삭제 성공:', existingPhoto.url);
        } catch (deleteError) {
          console.warn('기존 이미지 삭제 실패 (계속 진행):', deleteError.message);
          // alert는 제거하거나, 조건적으로만 사용하세요
        }
      }
      // 기존 preview URL 정리
      if (previewUrls.stay[index] && previewUrls.stay[index].startsWith('blob:')) {
        URL.revokeObjectURL(previewUrls.stay[index]);
      }

      // 새로운 preview URL 생성
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrls((prev) => ({
        ...prev,
        stay: { ...prev.stay, [index]: newPreviewUrl },
      }));

      // 즉시 S3에 업로드 (기존 이미지 덮어쓰기)
      const imageUrl = await worcationService.uploadImage(file, 'images');

      // 업로드된 URL과 함께 스토어에 저장
      const newList = [...stayPhotos];
      newList[index] = {
        file: file,
        url: imageUrl,
        uploaded: true,
      };
      setPhotos({
        ...photos,
        stayPhotos: newList,
      });
    } catch (error) {
      console.error('숙소 이미지 처리 실패:', error);
      alert('숙소 이미지 처리 실패');
    }
  };

  const handleOfficeDelete = async (index) => {
    try {
      // 기존 이미지가 있으면 S3에서 삭제
      const existingPhoto = officePhotos[index];
      if (existingPhoto && existingPhoto.url && typeof existingPhoto.url === 'string') {
        try {
          await worcationService.deleteImage(existingPhoto.url);
        } catch (deleteError) {
          console.warn('기존 이미지 삭제 실패:', deleteError);
          // 삭제 실패해도 계속 진행
        }
      }

      // preview URL 정리
      if (previewUrls.office[index] && previewUrls.office[index].startsWith('blob:')) {
        URL.revokeObjectURL(previewUrls.office[index]);
      }

      // preview URL 상태에서 제거
      setPreviewUrls((prev) => {
        const newOffice = { ...prev.office };
        delete newOffice[index];
        return { ...prev, office: newOffice };
      });

      const newList = [...officePhotos];
      newList.splice(index, 1);
      setPhotos({
        ...photos,
        officePhotos: newList,
      });
    } catch (error) {
      console.error('오피스 이미지 삭제 실패:', error);
      alert('오피스 이미지 삭제 실패');
    }
  };

  const handleStayDelete = async (index) => {
    try {
      // 기존 이미지가 있으면 S3에서 삭제
      const existingPhoto = stayPhotos[index];
      if (existingPhoto && existingPhoto.url && typeof existingPhoto.url === 'string') {
        try {
          await worcationService.deleteImage(existingPhoto.url);
        } catch (deleteError) {
          console.warn('기존 이미지 삭제 실패:', deleteError);
          // 삭제 실패해도 계속 진행
        }
      }

      // preview URL 정리
      if (previewUrls.stay[index] && previewUrls.stay[index].startsWith('blob:')) {
        URL.revokeObjectURL(previewUrls.stay[index]);
      }

      // preview URL 상태에서 제거
      setPreviewUrls((prev) => {
        const newStay = { ...prev.stay };
        delete newStay[index];
        return { ...prev, stay: newStay };
      });

      const newList = [...stayPhotos];
      newList.splice(index, 1);
      setPhotos({
        ...photos,
        stayPhotos: newList,
      });
    } catch (error) {
      console.error('숙소 이미지 삭제 실패:', error);
      alert('숙소 이미지 삭제 실패');
    }
  };

  const hasFolder = (str) => str && (str.includes('/') || str.startsWith('images/'));
  const getPreviewUrl = (photo, idx, type = 'stay') => {
    if (previewUrls[type][idx]) return previewUrls[type][idx];
    if (photo?.url) {
      if (photo.url.startsWith('http')) return photo.url;
      return hasFolder(photo.url) ? CLOUDFRONT_DOMAIN + photo.url : CLOUDFRONT_DOMAIN + 'images/' + photo.url;
    }
    if (photo?.change_name) {
      if (photo.change_name.startsWith('http')) return photo.change_name;
      return hasFolder(photo.change_name)
        ? CLOUDFRONT_DOMAIN + photo.change_name
        : CLOUDFRONT_DOMAIN + 'images/' + photo.change_name;
    }
    if (typeof photo === 'string') {
      if (photo.startsWith('http')) return photo;
      return hasFolder(photo) ? CLOUDFRONT_DOMAIN + photo : CLOUDFRONT_DOMAIN + 'images/' + photo;
    }
    return '';
  };

  return (
    <Body>
      <Title>사진을 추가해주세요.(각 최대 4개)</Title>
      <Table>
        <TBody>
          <TR>
            <TH>오피스 사진</TH>
            <TD>
              {officePhotos.map((photo, i) => (
                <ImageUploader
                  key={i}
                  label={i === 0 ? '메인 사진' : '추가 사진'}
                  onChange={(file) => handleOfficeChange(file, i)}
                  onDelete={() => handleOfficeDelete(i)}
                  previewUrl={getPreviewUrl(photo, i, 'office')}
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
              {stayPhotos.map((photo, i) => (
                <ImageUploader
                  key={i}
                  label={i === 0 ? '메인 사진' : '추가 사진'}
                  onChange={(file) => handleStayChange(file, i)}
                  onDelete={() => handleStayDelete(i)}
                  previewUrl={getPreviewUrl(photo, i, 'stay')}
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
