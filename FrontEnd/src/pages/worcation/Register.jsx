import React, { useState } from 'react';
import styled from 'styled-components';
import Menu from './Menu.jsx';
import ApplicationForm from './form/ApplicationForm.jsx';
import InfoForm from './form/InfoForm.jsx';
import DescriptionForm from './form/DescriptionForm.jsx';
import PhotoForm from './form/PhotoForm.jsx';
import AmenitiesForm from './form/AmenitiesForm.jsx';
import LocationForm from './form/LocationForm.jsx';
import PolicyForm from './form/PolicyForm.jsx';
import FeatureForm from './form/FeatureForm.jsx';
import { BtnWhiteYellowBorder } from '../../styles/Button.styles';
import Swal from 'sweetalert2';
import SwalStyles from '../../styles/SwalStyles';
import useWorcationStore from '../../store/worcationStore';

const Register = () => {
  const [selectedMenu, setSelectedMenu] = useState('Application');
  const isValidate = useWorcationStore((state) => state.isValidate);
  const isNonNull = useWorcationStore((state) => state.isNonNull);

  const handleSave = () =>
    Swal.fire({
      title: '저장하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '저장',
      cancelButtonText: '취소',
      buttonsStyling: true,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('저장');
      }
    });
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
        <FormContent>
          <Menu onMenuSelect={setSelectedMenu} selectedMenu={selectedMenu} />
          <FormActions>
            <ActionButton>미리 보기</ActionButton>
            {renderForm()}
          </FormActions>
        </FormContent>
        <FormFooter>
          {isValidate ? (
            <>
              <ActionButton type="button" onClick={handleSave}>
                임시 저장
              </ActionButton>
            </>
          ) : (
            <>
              <ActionButton type="button" style={{ opacity: 0.3 }}>
                임시 저장
              </ActionButton>
            </>
          )}
          {isNonNull ? (
            <>
              <ActionButton>등록</ActionButton>
            </>
          ) : (
            <>
              <ActionButton type="button" style={{ opacity: 0.3 }}>
                등록
              </ActionButton>
            </>
          )}
        </FormFooter>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default Register;
const FormContent = styled.div`
  display: flex;
  gap: 20px;
`;

const ActionButton = styled(BtnWhiteYellowBorder)`
  height: 30px;
  margin: 5px 0px 10px 20px;
  margin-left: auto;
  padding: 15px 10px;
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

const RegisterForm = styled.form`
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-direction: column;
`;

const FormActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const FormFooter = styled.div`
  display: flex;
  gap: 20px;
`;
