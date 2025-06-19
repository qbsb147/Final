// SwalStyles.js
import { createGlobalStyle } from 'styled-components';

const SwalStyles = createGlobalStyle`
  .swal2-confirm {
    background-color: ${({ theme }) => theme.colors.secondary} !important;
    border: 1px solid ${({ theme }) => theme.colors.secondary} !important;
    color: ${({ theme }) => theme.colors.black} !important;
    padding: 8px 20px;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
  }

  .swal2-cancel {
    background-color:${({ theme }) => theme.colors.danger} !important;
    border: 1px solid #d33 !important;
    color: ${({ theme }) => theme.colors.black} !important;
    padding: 8px 20px;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
  }

  .swal2-confirm:hover {
    background-color: ${({ theme }) => theme.colors.white} !important;
  }

  .swal2-cancel:hover {
    background-color: ${({ theme }) => theme.colors.white}!important;
  }
`;

export default SwalStyles;
