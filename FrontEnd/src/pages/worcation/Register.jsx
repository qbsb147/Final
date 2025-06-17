import React, { useState } from 'react';
import styled from 'styled-components';
import Menu from './element/Menu';
import ApplicationForm from './element/register/ApplicationForm';
import InfoForm from './element/register/InfoForm';
import DescriptionForm from './element/register/DescriptionForm';
import PhotoForm from './element/register/PhotoForm';
import AmenitiesForm from './element/register/AmenitiesForm';
import LocationForm from './element/register/LocationForm';
import PolicyForm from './element/register/PolicyForm';
import FeatureForm from './element/register/FeatureForm';
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
