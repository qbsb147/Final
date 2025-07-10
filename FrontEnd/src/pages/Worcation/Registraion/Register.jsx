import React, { useState } from 'react';
import styled from 'styled-components';
import Menu from '../../../components/worcation/Register/Menu.jsx';
import ApplicationForm from '../../../components/worcation/Register/Form/ApplicationForm.jsx';
import InfoForm from '../../../components/worcation/Register/Form/InfoForm.jsx';
import DescriptionForm from '../../../components/worcation/Register/Form/DescriptionForm.jsx';
import PhotoForm from '../../../components/worcation/Register/Form/PhotoForm.jsx';
import AmenitiesForm from '../../../components/worcation/Register/Form/AmenitiesForm.jsx';
import LocationForm from '../../../components/worcation/Register/Form/LocationForm.jsx';
import PolicyForm from '../../../components/worcation/Register/Form/PolicyForm.jsx';
import FeatureForm from '../../../components/worcation/Register/Form/FeatureForm.jsx';
import { BtnWhiteYellowBorder } from '../../../styles/Button.styles.js';
import Swal from 'sweetalert2';
import SwalStyles from '../../../styles/SwalStyles.js';
import useBusinessStore from '../../../store/useBusinessStore.js';
import useWorcationStore from '../../../store/useWorcationStore';
import useAuthStore from '../../../store/authStore.js';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { worcationService } from '../../../api/worcations.js';

const Register = () => {
  const [selectedMenu, setSelectedMenu] = useState('Application');
  const isValidate = useWorcationStore((state) => state.isValidate());
  const isNonNull = useWorcationStore((state) => state.isNonNull());
  const worcationData = useWorcationStore((state) => state);
  const { worcation_no } = useParams();
  const isVerified = useBusinessStore((state) => state.isVerified);
  const navigate = useNavigate();

  const handleSample = async () => {
    if (worcation_no) {
      try {
        const res = await worcationService.getDetail(worcation_no); //바로 await
        const data = res.data;

        useWorcationStore.setApplication(data.application);
        useWorcationStore.setInfo(data.info);
        useWorcationStore.setDescription(data.description);
        useWorcationStore.setPhotos(data.photos);
        useWorcationStore.setAmenities(data.amenities);
        useWorcationStore.setLocation(data.location);
        useWorcationStore.setPolicy(data.policy);
        useWorcationStore.setFeature(data.feature);
      } catch (err) {
        console.error('데이터 불러오기 실패:', err);
        Swal.fire('불러오기 실패', '다시 시도해주세요.', 'error');
      }
    }
  };
  const loginUser = useAuthStore((state) => state.loginUser);

  useEffect(() => {
    console.log('로그인 유저 확인:', loginUser);
  }, [loginUser]);

  useEffect(() => {
    handleSample(); // 처음 들어올 때 id가 있으면 자동 로딩
  }, [worcation_no]);

  const toRequestDto = () => {
    const loginUser = useAuthStore.getState().loginUser;
    const {
      application = {},
      info = {},
      description = {},
      photos = {},
      amenities = [],
      location = {},
      policy = {},
      feature = {},
    } = useWorcationStore.getState();

    const photo_urls = [];
    if (Array.isArray(photos.officePhotos)) {
      photos.officePhotos
        .filter((url) => !!url) // null, undefined, '' 제거
        .forEach((url) => photo_urls.push(url));
    }

    if (Array.isArray(photos.stayPhotos)) {
      photos.stayPhotos.filter((url) => !!url).forEach((url) => photo_urls.push(url));
    }
    return {
      worcation_name: application.worcation_name ?? '',
      worcation_category: application.worcation_category ?? null,
      main_change_photo: photos.thumbnail || 'https://dummy.com/default.jpg',
      worcation_thema: info.theme ?? '',
      max_people: info.maxPeople ? parseInt(info.maxPeople) : null,
      partner_price: info.partnerPrice ? parseInt(info.partnerPrice) : null,
      non_partner_price: info.nonPartnerPrice ? parseInt(info.nonPartnerPrice) : null,
      worcation_address: location.address ?? '',

      member_id: loginUser.user_no ?? '',
      licensee: application.licensee ?? '',
      business_id: application.business_id ?? '',
      worcation_tel: info.phone ?? '',
      charge_amount: 0,
      content: description.detailIntro ?? '',
      navigate: location.locationDescription ?? '',
      available_time: policy.policyGuide || '09:00~18:00',
      refund_policy: policy.refundPolicy ?? '',
      open_date: application.open_date?.split('T')[0] || '2025-07-10',

      location_type: feature.locationType ?? null,
      dominant_color: feature.dominantColor ?? null,
      space_mood: feature.spaceMood ?? null,
      best_for: feature.bestFor ?? null,
      activities: Array.isArray(feature.activities) ? feature.activities.join(',') : '',
      accommodation_type: feature.accommodationType ?? null,

      amenities: amenities ?? [],
      photo_urls: photo_urls.length > 0 ? photo_urls : ['https://dummy.com/default.jpg'],
    };
  };

  // const handleSave = () =>
  //   Swal.fire({
  //     title: '저장하시겠습니까?',
  //     showCancelButton: true,
  //     confirmButtonText: '저장',
  //     cancelButtonText: '취소',
  //     buttonsStyling: true,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       console.log('저장');
  //     }
  //   });
  const handleSave = async () => {
    const result = await Swal.fire({
      title: '임시 저장하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '저장',
      cancelButtonText: '취소',
    });

    if (result.isConfirmed) {
      try {
        const dto = toRequestDto();
        if (worcation_no) {
          await worcationService.update(worcation_no, dto);
        } else {
          await worcationService.samplesave(dto);
        }
        Swal.fire('임시 저장되었습니다.', '', 'success');
        navigate('/worcation/list');
      } catch (error) {
        console.error('임시 저장 실패:', error);
        Swal.fire('임시 저장 실패', '다시 시도해주세요.', 'error');
      }
    }
  };

  const isBusinessValidated = useBusinessStore((state) => !!state.formData.businessId);

  const handleSubmit = async () => {
    const result = await Swal.fire({
      title: '등록하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '등록',
      cancelButtonText: '취소',
    });
    if (result.isConfirmed) {
      try {
        const dto = toRequestDto();
        if (worcation_no) {
          await worcationService.update(worcation_no, dto);
        } else {
          await worcationService.save(dto);
        }
        Swal.fire('등록 완료!', '', 'success');
        navigate('/worcation/list');
      } catch (error) {
        console.error('등록 실패:', error);
        Swal.fire('등록 실패', '다시 시도해주세요.', 'error');
      }
    }
  };
  const renderForm = () => {
    switch (selectedMenu) {
      case 'Application':
        return <ApplicationForm />;
      case 'Info':
        return <InfoForm />;
      case 'Description':
        return <DescriptionForm />;
      case 'Photo':
        return <PhotoForm />;
      case 'Amenities':
        return <AmenitiesForm />;
      case 'Location':
        return <LocationForm />;
      case 'Policy':
        return <PolicyForm />;
      case 'Feature':
        return <FeatureForm />;
      default:
        return <ApplicationForm />;
    }
  };

  return (
    <RegisterContainer>
      <SwalStyles />
      <RegisterForm>
        <MenuBar>
          <Menu onMenuSelect={setSelectedMenu} selectedMenu={selectedMenu} />
          <ContentContainer>
            <BtnGroup>
              <ActionButton type="button" onClick={handleSample}>
                미리 보기
              </ActionButton>
            </BtnGroup>
            <RenderForm>{renderForm()}</RenderForm>
          </ContentContainer>
        </MenuBar>
        <BtnGroup>
          {isVerified ? (
            <ActionButton type="button" onClick={handleSave}>
              임시 저장
            </ActionButton>
          ) : (
            <ActionButton type="button" disabled style={{ background: '#AEAEAE' }}>
              임시 저장
            </ActionButton>
          )}
          {isNonNull ? (
            <>
              <ActionButton disabled={!isBusinessValidated} style={{ background: '#AEAEAE' }}>
                등록
              </ActionButton>
            </>
          ) : (
            <>
              <ActionButton type="button" onClick={handleSubmit} style={{ opacity: 0.3 }}>
                등록
              </ActionButton>
            </>
          )}
        </BtnGroup>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default Register;

const ActionButton = styled(BtnWhiteYellowBorder)`
  max-height: 20px;
`;
const BtnGroup = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  min-height: 50px;
  gap: 10px;
`;
const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 1280px;
  min-height: 500px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 10px;
`;

const RegisterContainer = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const MenuBar = styled.div`
  display: flex;
  gap: 20px;
`;
const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-end;
  flex-direction: column;
`;
const RenderForm = styled.div`
  background-color: #fff;
  display: flex;
  min-width: 1000px;
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
`;
