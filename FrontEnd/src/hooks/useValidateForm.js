import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { worcationService } from '../api/worcations';
import { toast } from 'react-toastify';
import worcationStore from '../store/worcationStore';
import useAuthStore from '../store/authStore';

//회원가입 폼의 유효성 검사 스키마
const ValidateSchema = yup.object().shape({
  licensee: yup.string().required('사업자 명을 입력... '),

  worcation_name: yup.string().required('상호명을 입력...'),

  open_date: yup.date().typeError('유효한 날짜를 선택해주세요').required('개업일 선택...'),

  business_id: yup
    .string()
    .matches(/^\d{10}$/, '사업자등록번호는 10자리 숫자여야 합니다.')
    .required('사업자등록번호 입력...'),
});

export const useValidateForm = () => {
  const { setIsValidate } = worcationStore();
  const { user } = useAuthStore();
  //react-hook-form으로 폼 상태 초기화및 유효성 검사
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }, //유효성 에러및 제출중 상태
    watch,
  } = useForm({
    resolver: yupResolver(ValidateSchema), // yup스키마와 연결
    mode: 'onChange',
  });
  const validate = async (data) => {
    try {
      /*
      국세청 API 확인
      await worcationService.validation({
        licensee: data.licensee,
        worcation_name: data.worcation_name,
        open_date: data.open_date,
        business_id: data.business_id,
      });
      */
      console.log('true', true);
      setIsValidate(true); // 국세청 api로 적용돼야함
      toast.success('진위정보를 확인하였습니다. 다음 단계를 진행하세요');
    } catch (error) {
      toast.error('진위정보 확인 중 문제가 발생하였습니다.');
      console.error('진위정보 확인 에러 : ', error);
    }
  };

  //컴포넌트에서 사용할 값들 반환
  return {
    register,
    control,
    handleValidate: handleSubmit(validate),
    errors,
    isSubmitting,
    watch,
  };
};
