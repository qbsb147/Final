// useValidation.js
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const businessValidationSchema = yup.object().shape({
  licensee: yup.string().required('사업자 명을 입력해주세요.'),
  worcation_name: yup.string().required('상호명을 입력해주세요.'),
  open_date: yup.date().typeError('유효한 날짜를 선택해주세요').required('개업일을 선택해주세요.'),
  business_id: yup
    .string()
    .matches(/^[0-9]{10}$/, '사업자등록번호는 10자리 숫자여야 합니다.')
    .required('사업자등록번호를 입력해주세요.'),
});

export const useValidation = () => {
  const {
    register,
    control,
    getValues,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: yupResolver(businessValidationSchema),
    mode: 'onChange',
  });

  return {
    register,
    control,
    getValues,
    errors,
    isSubmitting,
    watch,
  };
};