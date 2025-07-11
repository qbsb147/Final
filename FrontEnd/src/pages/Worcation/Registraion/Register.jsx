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
  const resetStore = useWorcationStore((state) => state.reset);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataOrReset = async () => {
      if (worcation_no) {
        // 수정 모드
        try {
          const data = await worcationService.getDetail(worcation_no);
          const store = useWorcationStore.getState();
          console.log('✅ [DATA]', data);
          console.log('▶ worcation_name:', data.worcation_name);
          console.log('▶ photos:', data.photos);
          console.log('▶ amenities:', data.amenities);

          // 각 스토어 슬라이스에 데이터 설정
          store.setApplication({
            worcation_name: data.worcation_name,
            worcation_category: data.worcation_category,
            licensee: data.licensee,
            business_id: data.business_id,
            open_date: data.open_date ? new Date(data.open_date) : null,
          });
          store.setInfo({
            theme: data.worcation_thema,
            maxPeople: data.max_people,
            partnerPrice: data.partner_price,
            nonPartnerPrice: data.non_partner_price,
            phone: data.worcation_tel,
          });
          store.setDescription({ detailIntro: data.content });
          store.setPhotos({
            thumbnail: data.main_change_photo,
            officePhotos: data.photos?.filter((p) => p.type === 'OFFICE').map((p) => p.change_name) || [],
            stayPhotos: data.photos?.filter((p) => p.type === 'STAY').map((p) => p.change_name) || [],
          });
          store.setLocation({
            address: data.worcation_address,
            locationDescription: data.navigate,
          });
          store.setPolicy({
            policyGuide: data.available_time,
            refundPolicy: data.refund_policy,
          });
          store.setFeature({
            locationType: data.location_type,
            dominantColor: data.dominant_color,
            spaceMood: data.space_mood,
            bestFor: data.best_for,
            activities: data.activities ? data.activities.split(',') : [],
            accommodationType: data.accommodation_type,
          });
          store.setAmenities(data.amenities?.map((a) => a.amenity_no) || []);
        } catch (error) {
          console.error('워케이션 데이터 로딩 실패:', error);
          Swal.fire('오류', '데이터를 불러오는 중 문제가 발생했습니다.', 'error');
        }
      } else {
        // 등록 모드
        resetStore();
      }
    };

    fetchDataOrReset();
  }, [worcation_no, resetStore]); // worcation_no가 바뀔 때마다 다시 실행

  const handleSample = async () => {
    if (!worcation_no) return;

    try {
      const data = await worcationService.getDetail(worcation_no);
      const store = useWorcationStore.getState();

      store.setApplication({
        worcation_name: data.worcation_name,
        worcation_category: data.worcation_category,
        licensee: data.licensee,
        business_id: data.business_id,
        open_date: data.open_date ? new Date(data.open_date) : null,
      });

      store.setInfo({
        theme: data.worcation_thema,
        maxPeople: data.max_people,
        partnerPrice: data.partner_price,
        nonPartnerPrice: data.non_partner_price,
        phone: data.worcation_tel,
      });

      store.setDescription({ detailIntro: data.content });

      store.setPhotos({
        thumbnail: data.main_change_photo,
        officePhotos: data.photos?.filter((p) => p.type === 'OFFICE').map((p) => p.change_name) || [],
        stayPhotos: data.photos?.filter((p) => p.type === 'STAY').map((p) => p.change_name) || [],
      });

      store.setLocation({
        address: data.worcation_address,
        locationDescription: data.navigate,
      });

      store.setPolicy({
        policyGuide: data.available_time,
        refundPolicy: data.refund_policy,
      });

      store.setFeature({
        locationType: data.location_type,
        dominantColor: data.dominant_color,
        spaceMood: data.space_mood,
        bestFor: data.best_for,
        activities: data.activities ? data.activities.split(',') : [],
        accommodationType: data.accommodation_type,
      });

      store.setAmenities(data.amenities?.map((a) => a.amenity_no) || []);
    } catch (err) {
      console.error('미리보기 데이터 로딩 실패:', err);
      Swal.fire('불러오기 실패', '다시 시도해주세요.', 'error');
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
      status = 'N',
    } = useWorcationStore.getState();

    const photo_urls = [
      ...(Array.isArray(photos.officePhotos) ? photos.officePhotos.filter(Boolean) : []),
      ...(Array.isArray(photos.stayPhotos) ? photos.stayPhotos.filter(Boolean) : []),
    ];

    return {
      worcation_name: application.worcation_name, // application에서 가져와야 함
      worcation_category: application.worcation_category,
      main_change_photo: photos.thumbnail,
      worcation_thema: info.theme,
      max_people: parseInt(info.maxPeople),
      partner_price: parseInt(price.partnerPrice),
      non_partner_price: parseInt(price.nonPartnerPrice),
      worcation_address: location.address,
      member_id: loginUser?.user_no,
      licensee: application.licensee,
      business_id: application.business_id,
      worcation_tel: info.phone,

      charge_amount: parseInt(info.chargeAmount), // info.chargeAmount 없으면 NaN
      content: description.detailIntro,
      navigate: location.locationDescription,
      available_time: policy.policyGuide,
      refund_policy: policy.refundPolicy,

      open_date: application.open_date
        ? new Date(application.open_date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],

      location_type: feature.locationType,
      dominant_color: feature.dominantColor,
      space_mood: feature.spaceMood,
      best_for: feature.bestFor,
      activities: feature.activities?.join(','),
      accommodation_type: feature.accommodationType,

      amenities: Array.isArray(amenities) ? amenities : [],
      photo_urls: [...(photos.officePhotos || []), ...(photos.stayPhotos || [])],

      status,
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
        useWorcationStore.getState().setStatus('N');
        const dto = toRequestDto();
        if (worcation_no) {
          await worcationService.update(worcation_no, dto);
        } else {
          await worcationService.save(dto);
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
        useWorcationStore.getState().setStatus('Y');
        const dto = toRequestDto();
        console.log(dto);
        if (worcation_no) {
          await worcationService.update(worcation_no, dto);
        } else {
          await worcationService.save(dto);
        }
        Swal.fire('등록 완료!', '', 'success');
        navigate('/worcation/register-list');
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
          <ActionButton
            type="button"
            onClick={handleSave}
            disabled={!isVerified}
            style={{
              background: !isVerified ? '#AEAEAE' : '',
              opacity: !isVerified ? 0.3 : 1,
            }}
          >
            임시 저장
          </ActionButton>

          <ActionButton
            type="button"
            onClick={handleSubmit}
            disabled={!(isNonNull && isBusinessValidated)}
            style={{
              background: !(isNonNull && isBusinessValidated) ? '#AEAEAE' : '',
              opacity: !(isNonNull && isBusinessValidated) ? 0.3 : 1,
            }}
          >
            등록
          </ActionButton>
        </BtnGroup>
        {/* <BtnGroup>
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
              <ActionButton disabled={!isBusinessValidated}>등록</ActionButton>
            </>
          ) : (
            <>
              <ActionButton type="button" onClick={handleSubmit} style={{ opacity: 0.3 }}>
                등록
              </ActionButton>
            </>
          )}
        </BtnGroup> */}
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
