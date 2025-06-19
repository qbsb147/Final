import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { userService } from '../api/users';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useUserStore from '../store/userStore';

//회원가입 폼의 유효성 검사 스키마
const loginSchema = yup.object().shape({
  email: yup.string().email('유효한 이메일 주소를 입력...').required('이메일을 입력...'),

  password: yup.string().min(8, '비밀번호는 8자 이상...').required('비밀번호를 입력...'),
});

export const useLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);

  //react-hook-form으로 폼 상태 초기화및 유효성 검사
  const {
    register,
    handleSubmit,
    formState: { errors }, //유효성 에러및 제출중 상태
  } = useForm({
    resolver: yupResolver(loginSchema), // yup스키마와 연결
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      //로그인API호출
      const user = await userService.login(data.email, data.password);
      if (!user) {
        throw new Error('이메일 또는 비밀번호 불일치');
      }

      console.log();

      //로그인 성공시 store에 로그인 정보를 저장
      login({
        email: user.email,
        username: user.username,
        role: user.role,
      });

      toast.success('로그인 성공!');
      navigate('/');
    } catch (error) {
      toast.error('로그인 중 문제가 발생하였습니다.');
      console.error('로그인 에러 : ', error);
    } finally {
      setIsLoading(false);
    }
  };

  //컴포넌트에서 사용할 값들 반환
  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
  };
};
