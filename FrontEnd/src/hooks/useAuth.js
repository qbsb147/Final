import Swal from 'sweetalert2';
import memberService from '../api/members';
import { loginSchema } from '../schemas/schema';
import useAuthStore from '../store/authStore';

export async function validateForm(schema, data) {
  try {
    await schema.validate(data, { abortEarly: false });
    return true;
  } catch (err) {
    if (err.inner && err.inner.length > 0) {
      alert(err.inner[0].message);
    } else {
      alert(err.message);
    }
    return false;
  }
}

export async function validateLogin(data) {
  try {
    await loginSchema.validate(data, { abortEarly: false });
    return true;
  } catch (err) {
    if (err.inner && err.inner.length > 0) {
      alert(err.inner[0].message);
    } else {
      alert(err.message);
    }
    return false;
  }
}

// validateMypageForm 등 yup 관련 함수는 필요하다면 schema.jsx에서 관리, 아니면 완전히 삭제
// 나머지 함수/로직은 그대로 유지

export function useValidatePassword() {
  const { loginUser } = useAuthStore();
  // 현재 비밀번호 검증 함수
  const validateCurrentPassword = async () => {
    console.log('loginUser.social_type', loginUser.social_type);
    if (loginUser?.social_type != null) {
      return true;
    }
    const { value: currentPassword } = await Swal.fire({
      title: '현재 비밀번호 확인',
      text: '정보 수정을 위해 현재 비밀번호를 입력해주세요.',
      input: 'password',
      inputPlaceholder: '현재 비밀번호를 입력하세요',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      inputValidator: (value) => {
        if (!value) {
          return '현재 비밀번호를 입력해주세요!';
        }
      },
    });

    if (currentPassword) {
      try {
        await memberService.validateCurrentPassword(currentPassword);
        return true;
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: '비밀번호 오류',
          text: err,
          confirmButtonColor: '#3085d6',
        });
        return false;
      }
    }
    return false;
  };

  return { validateCurrentPassword };
}

export function formatPhoneNumber(value) {
  // 숫자만 남기고, 11자리까지만 허용
  let onlyNums = value.replace(/[^0-9]/g, '').slice(0, 11);

  if (onlyNums.length < 4) return onlyNums;
  if (onlyNums.length < 8) {
    // 4자리에서 하이픈
    return onlyNums.replace(/(\d{3})(\d{1,})/, '$1-$2');
  }
  // 8자리 이상: 3-4-나머지
  return onlyNums.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3');
}

export function formatBusinessNumber(value) {
  // 숫자만 남기고, 10자리까지만 허용
  let onlyNums = value.replace(/[^0-9]/g, '').slice(0, 10);

  if (onlyNums.length < 4) return onlyNums;
  if (onlyNums.length < 6) {
    // 4~5자리: 3-나머지
    return onlyNums.replace(/(\d{3})(\d{1,2})/, '$1-$2');
  }
  // 6자리 이상: 3-2-나머지(최대 5자리)
  return onlyNums.replace(/(\d{3})(\d{2})(\d{1,5})/, '$1-$2-$3');
}
