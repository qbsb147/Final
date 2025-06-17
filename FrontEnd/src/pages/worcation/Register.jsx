import React, { useState } from 'react';
import styled from 'styled-components';
import Menu from '../../components/worcation/register/Menu';
import ApplicationForm from '../../components/worcation/register/ApplicationForm';
import InfoForm from '../../components/worcation/register/InfoForm';
import DescriptionForm from '../../components/worcation/register/DescriptionForm';
import PhotoForm from '../../components/worcation/register/PhotoForm';
import AmenitiesForm from '../../components/worcation/register/AmenitiesForm';
import LocationForm from '../../components/worcation/register/LocationForm';
import PolicyForm from '../../components/worcation/register/PolicyForm';
import FeatureForm from '../../components/worcation/register/FeatureForm';
import { BtnWhiteYellowBorder } from '../../styles/Button.styles';

const Register = () => {
  const [selectedMenu, setSelectedMenu] = useState('Application');

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
      <RegisterForm>
        <FormContent>
          <Menu onMenuSelect={setSelectedMenu} selectedMenu={selectedMenu} />
          <FormActions>
            <ActionButton>미리 보기</ActionButton>
            {renderForm()}
          </FormActions>
        </FormContent>
        <FormFooter>
          <ActionButton>임시 저장</ActionButton>
          <ActionButton>등록</ActionButton>
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
