import React from 'react';
import * as yup from 'yup';

export const step1Schema = yup.object().shape({
    userId: yup
      .string()
      .matches(/^[a-zA-Z0-9]{4,12}$/, '아이디는 4~12자의 영문 및 숫자만 가능합니다.')
      .required('아이디를 입력해주세요.'),
      
    userPwd: yup
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.'
      )
      .required('비밀번호를 입력해주세요.'),
  
    userPwdCheck: yup
      .string()
      .oneOf([yup.ref('userPwd')], '비밀번호가 일치하지 않습니다.')
      .required('비밀번호 확인을 입력해주세요.'),
  
    name: yup
      .string()
      .matches(/^[가-힣a-zA-Z\s]{2,20}$/, '이름은 2~20자의 한글 또는 영문만 가능합니다.')
      .required('이름을 입력해주세요.'),
  
    address: yup.string().required('주소를 입력해주세요.'),
  
    birthday: yup
      .string()
      .matches(/^\d{4}-\d{2}-\d{2}$/, '생년월일 형식은 YYYY-MM-DD입니다.')
      .required('생년월일을 입력해주세요.'),
  
    email: yup
      .string()
      .email('유효한 이메일 형식이 아닙니다.')
      .required('이메일을 입력해주세요.'),
  
    phone: yup
      .string()
      .matches(/^01[0-9]-\d{3,4}-\d{4}$/, '연락처 형식은 010-xxxx-xxxx입니다.')
      .required('연락처를 입력해주세요.'),
  });
  

  export const step2SchemaTypeA = yup.object().shape({
    companyName: yup.string().required('회사명을 입력해주세요.'),
    department: yup.string().required('부서명을 입력해주세요.'),
    position: yup.string().required('직급을 입력해주세요.'),
    address: yup.string().required('회사주소를 입력해주세요.'),
  
    companyEmail: yup
      .string()
      .email('유효한 이메일 형식이 아닙니다.')
      .required('회사 이메일을 입력해주세요.'),
  
    companyPhone: yup
      .string()
      .matches(/^\d{2,3}-\d{3,4}-\d{4}$/, '전화번호 형식이 올바르지 않습니다.')
      .required('회사 전화번호를 입력해주세요.'),
  });
  

  export const step2SchemaTypeB = yup.object().shape({
    companyName: yup.string().required('기업명을 입력해주세요.'),
    businessId: yup
      .string()
      .matches(/^\d{3}-\d{2}-\d{5}$/, '사업자번호 형식은 000-00-00000입니다.')
      .required('사업자번호를 입력해주세요.'),
  
    businessName: yup.string().required('사업자명을 입력해주세요.'),
  
    openDate: yup
      .string()
      .matches(/^\d{4}-\d{2}-\d{2}$/, '개업일 형식은 YYYY-MM-DD입니다.')
      .required('개업일을 입력해주세요.'),
  
    address: yup.string().required('기업주소를 입력해주세요.'),
  
    email: yup
      .string()
      .email('유효한 이메일 형식이 아닙니다.')
      .required('이메일을 입력해주세요.'),
  
    companyTel: yup
      .string()
      .matches(/^\d{2,3}-\d{3,4}-\d{4}$/, '전화번호 형식이 올바르지 않습니다.')
      .required('기업 전화번호를 입력해주세요.'),
  });
  
  export const loginSchema = yup.object().shape({
    userId: yup
      .string()
      .required('아이디를 입력해주세요.')
      .matches(/^[a-zA-Z0-9]{4,12}$/, '아이디는 4~12자의 영문 및 숫자만 가능합니다.'),
  
    userPwd: yup
      .string()
      .required('비밀번호를 입력해주세요.')
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
  });
  