import React from 'react';
import styled from 'styled-components';

const AddButton = ({ onClick }) => {
  return (
    <Add onClick={onClick}>
      <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 19C12.5269 19 12.9534 18.5723 12.9534 18.087V12.9377H18.055C18.5651 12.9377 19 12.5182 19 12C19 11.49 18.5651 11.0623 18.055 11.0623H12.9534V5.91304C12.9534 5.41951 12.5269 5 12 5C11.4815 5 11.0466 5.41951 11.0466 5.91304V11.0623H5.94504C5.45161 11.0623 5 11.49 5 12C5 12.5182 5.45161 12.9377 5.94504 12.9377H11.0466V18.087C11.0466 18.5723 11.4815 19 12 19Z"
          fill="#717171"
        />
      </svg>
    </Add>
  );
};

export default AddButton;

const Add = styled.div`
  width: 75px;
  height: 75px;
  display: flex;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.gray[500]};
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
