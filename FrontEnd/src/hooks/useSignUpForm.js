import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { userService } from '../api/users';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

//회원가입 폼의 유효성 검사 스키마
const signUpSchema = yup.object().shape({
  username: yup
    .string()
    .min(2, '사용자 이름은 2자 이상...')
    .max(20, '사용자 이름은 20자 이하...')
    .required('사용자 이름을 입력...'),

  email: yup.string().email('유효한 이메일 주소를 입력...').required('이메일을 입력...'),

  password: yup
    .string()
    .min(8, '비밀번호는 8자 이상...')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, '비밀번호는 영문자와 숫자를 포함...')
    .required('비밀번호를 입력...'),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않음...')
    .required('비밀번호 확인 입력...'),
});

export const useSignUpForm = () => {
  const navigate = useNavigate();

  //react-hook-form으로 폼 상태 초기화및 유효성 검사
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, //유효성 에러및 제출중 상태
    watch,
  } = useForm({
    resolver: yupResolver(signUpSchema), // yup스키마와 연결
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    console.log('????');
    try {
      //중복이메일 체크
      // setError('email', {})

      //회원가입API호출
      await userService.signUp({
        username: data.username,
        email: data.email,
        password: data.password,
        role: 'user',
      });

      toast.success('회원가입 완료!');
      navigate('/login');
    } catch (error) {
      toast.error('회원가입 중 문제가 발생하였습니다.');
      console.error('회원가입 에러 : ', error);
    }
  };

  //컴포넌트에서 사용할 값들 반환
  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    watch,
  };
};
