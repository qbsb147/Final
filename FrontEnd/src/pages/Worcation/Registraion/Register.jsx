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
  const isNonNull = useWorcationStore((state) => state.isNonNull());
  const { worcation_no } = useParams();
  const isVerified = useBusinessStore((state) => state.isVerified);
  const navigate = useNavigate();

  const handleSample = async () => {
    if (worcation_no) {
      try {
        const res = await worcationService.getDetail(worcation_no);
        const data = res.data;

        useWorcationStore.setApplication({
          worcation_name: data.worcation_name,
          worcation_category: data.worcation_category,
          licensee: data.licensee,
          business_id: data.business_id,
          open_date: data.open_date?.join('-'),
        });

        useWorcationStore.setInfo({
          theme: data.worcation_thema,
          maxPeople: data.max_people,
          partnerPrice: data.partner_price,
          nonPartnerPrice: data.non_partner_price,
          phone: data.worcation_tel,
        });

        useWorcationStore.setDescription({
          detailIntro: data.content,
        });

        useWorcationStore.setPhotos({
          thumbnail: data.main_change_photo,
          officePhotos: [],
          stayPhotos: [],
        });

        useWorcationStore.setLocation({
          address: data.worcation_address,
          locationDescription: data.navigate,
        });

        useWorcationStore.setPolicy({
          policyGuide: data.available_time,
          refundPolicy: data.refund_policy,
        });

        useWorcationStore.setFeature({
          locationType: data.location_type,
          dominantColor: data.dominant_color,
          spaceMood: data.space_mood,
          bestFor: data.best_for,
          activities: data.activities?.split(','),
          accommodationType: data.accommodation_type,
        });

        useWorcationStore.setAmenities(data.amenities || []);
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
    const init = async () => {
      const store = useWorcationStore.getState();
      if (!worcation_no) {
        store.reset(); // 새 등록이면 초기화
      } else {
        await handleSample(); // 수정이면 데이터 불러오기
      }
    };

    init();
  }, []); //의존성 없이 최초 진입 시 1회만 실행

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
      price = {},
      feature = {},
    } = useWorcationStore.getState();

    const photo_urls = [
      ...(Array.isArray(photos.officePhotos) ? photos.officePhotos.filter(Boolean) : []),
      ...(Array.isArray(photos.stayPhotos) ? photos.stayPhotos.filter(Boolean) : []),
    ];

    return {
      worcation_name: info.worcationName || '',
      worcation_category: info.category || 'Office', // 예시 기본값
      main_change_photo: photos.mainPhoto || 'https://dummy.com/default.jpg',
      worcation_thema: info.intro || 'default',
      max_people: parseInt(info.maxPeople) || null,
      partner_price: parseInt(price.partnerPrice) || null,
      non_partner_price: parseInt(price.nonPartnerPrice) || null,
      worcation_address: location.address || '',
      member_id: loginUser?.user_no,
      licensee: application.ownerName || '',
      business_id: application.businessNo || '',
      worcation_tel: application.tel || '',
      charge_amount: info.chargeAmount || 0,
      content: description.detailIntro || '',
      navigate: policy.navigate || '',
      available_time: policy.availableTime || '09:00~18:00',
      refund_policy: policy.refundPolicy || '',
      open_date: application.open_date
        ? new Date(application.open_date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],

      location_type: feature.locationType || 'city',
      dominant_color: feature.dominantColor || 'achromatic',
      space_mood: feature.spaceMood || 'modern',
      best_for: feature.bestFor || 'work_efficiency',
      activities: feature.activities?.join(', ') || '',
      accommodation_type: feature.accommodationType || 'clean_convenient',
      amenities: amenities.list || [],
      photo_urls: photos.photos || [],
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
          console.log('✅ 최종 전송 데이터:\n', JSON.stringify(dto, null, 2));
          await worcationService.samplesave(dto);
        }
        Swal.fire('임시 저장되었습니다.', '', 'success');
        navigate('/worcation/register-list');
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
