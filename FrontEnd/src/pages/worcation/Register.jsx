import React from 'react';
import styled from 'styled-components';
import RegisterList from '../../components/list/RegisterList';

const Register = () => {
  return (
    <Body>
      <RegisterList />
    </Body>
  );
};

export default Register;

const Body = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  width: 100%;
  display: flex;
    justify-content: center;   // 수평 중앙
  align-items: center; 
`;
