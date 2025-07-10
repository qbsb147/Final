import React, { useState, useRef } from 'react';
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
import useWorcationStore from '../../../store/useWorcationStore.js';
import api from '../../../api/axios.js';
// import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [selectedMenu, setSelectedMenu] = useState('Application');
  const applicationFormRef = useRef();
  const infoFormRef = useRef();
  const descriptionFormRef = useRef();
  const photoFormRef = useRef();
  const amenitiesFormRef = useRef();
  const locationFormRef = useRef();
  const policyFormRef = useRef();
  const featureFormRef = useRef();
  const getAll = useWorcationStore((state) => state.getAll);
  // const isNonNull = useWorcationStore((state) => state.isNonNull);
  // const isValidate = useWorcationStore((state) => state.isValidate);
  // const navigate = useNavigate();

  const renderForm = () => {
    switch (selectedMenu) {
      case 'Application':
        return <ApplicationForm ref={applicationFormRef} />;
      case 'Info':
        return <InfoForm ref={infoFormRef} />;
      case 'Description':
        return <DescriptionForm ref={descriptionFormRef} />;
      case 'Photo':
        return <PhotoForm ref={photoFormRef} />;
      case 'Amenities':
        return <AmenitiesForm ref={amenitiesFormRef} />;
      case 'Location':
        return <LocationForm ref={locationFormRef} />;
      case 'Policy':
        return <PolicyForm ref={policyFormRef} />;
      case 'Feature':
        return <FeatureForm ref={featureFormRef} />;
      default:
        return <ApplicationForm ref={applicationFormRef} />;
    }
  };

  const handleSave = async () => {
    // if (!isValidate()) {
    //   alert('입력값을 모두 올바르게 입력해주세요.');
    //   return;
    // }
    const allValues = getAll();
    console.log(allValues); // 모든 폼 데이터가 한 객체로 출력됨

    const tmp = await Swal.fire({
      title: '임시 저장하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '저장',
      cancelButtonText: '취소',
    });
    if (tmp.isConfirmed) {
      try {
        //서버 전송 로직
        await api.saveTmpWorcation(allValues);
        Swal.fire('임시 저장되었습니다.', '', 'success');
        // navigate('/worcation/list');
      } catch (error) {
        console.log(error);
        Swal.fire('저장에 실패하였습니다.', '', 'error');
        return;
      }
    } else {
      return;
    }
  };
  const handleSubmit = async () => {
    // if (!isValidate()) {
    //   alert('입력값을 모두 올바르게 입력해주세요.');
    //   return;
    // }
    const allValues = getAll();

    const res = await Swal.fire({
      title: '등록하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '저장',
      cancelButtonText: '취소',
    });
    if (res.isConfirmed) {
      try {
        //서버 전송 로직
        await api.saveWorcation(allValues);
        Swal.fire('등록되었습니다.', '', 'success');
        // navigate('/worcation/list');
      } catch (error) {
        console.log(error);
        Swal.fire('등록에 실패하였습니다.', '', 'error');
        return;
      }
    } else {
      return;
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
              <ActionButton type="button">미리 보기</ActionButton>
            </BtnGroup>
            <RenderForm>{renderForm()}</RenderForm>
          </ContentContainer>
        </MenuBar>
        <BtnGroup>
          <ActionButton type="button" onClick={handleSave}>
            임시 저장
          </ActionButton>
          <ActionButton type="button" onClick={handleSubmit}>
            등록
          </ActionButton>
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
