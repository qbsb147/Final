import React from 'react';
import styled from 'styled-components';
import List from '../../components/worcation/register/List';
import Form from '../../components/worcation/register/AmenitiesForm';

const Register = () => {
  return (
    <Body>
      <InBody>
        <List />
        <Form />
      </InBody>
    </Body>
  );
};

export default Register;

const Body = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InBody = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-end;
`;
