import * as yup from 'yup';

// Default form validation schema
export const useDefaultForm = yup.object().shape({
  user_id: yup
    .string()
    .max(40, '아이디는 최대 40자까지 가능합니다.')
    .test('is-valid-user-id', '아이디는 영문+숫자 4~50자 또는 이메일 형식이어야 합니다.', (value) => {
      const idRegex = /^[a-zA-Z0-9]{4,50}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return idRegex.test(value) || emailRegex.test(value);
    })
    .required('아이디를 입력해주세요.'),
  user_pwd: yup
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,}$/, '비밀번호는 영문과 숫자를 반드시 포함해야 합니다.')
    .required('비밀번호를 입력해주세요.'),
  user_pwd_check: yup
    .string()
    .when('user_pwd', {
      is: (val) => !!val,
      then: (schema) => schema.oneOf([yup.ref('user_pwd')], '비밀번호가 일치하지 않습니다.'),
      otherwise: (schema) => schema,
    })
    .required('비밀번호 확인을 입력해주세요.'),
  name: yup
    .string()
    .matches(/^[가-힣a-zA-Z\s]{2,20}$/, '이름은 2~20자의 한글 또는 영문만 가능합니다.')
    .required('이름을 입력해주세요.'),
  address: yup.string().required('주소를 입력해주세요.'),
  birthday: yup
    .date()
    .typeError('유효한 날짜 형식이 아닙니다.')
    .max(new Date(), '생년월일은 이전 날이어야 합니다.')
    .required('생년월일을 입력해주세요.'),
  email: yup.string().email('유효한 이메일 형식이 아닙니다.').required('이메일을 입력해주세요.'),
  phone: yup
    .string()
    .matches(/^01[0-9]-\d{3,4}-\d{4}$/, '연락처 형식은 01x-xxxx-xxxx입니다.')
    .required('연락처를 입력해주세요.'),
});

// Employee form validation schema
export const useEmployeeForm = yup.object().shape({
  company_no: yup.number().required('회사 선택은 필수입니다.'),
  department_name: yup.string().required('부서를 선택해주세요.'),
  position_name: yup.string().required('직급을 입력해주세요.'),
  company_email: yup.string().email('유효한 이메일 형식이 아닙니다.').required('회사 이메일을 입력해주세요.'),
  company_phone: yup
    .string()
    .nullable()
    .notRequired()
    .matches(/^\d{2,3}-\d{3,4}-\d{4}$/, { message: '전화번호 형식이 올바르지 않습니다.', excludeEmptyString: true }),
});

// Master(회사) form validation schema
export const useMasterForm = yup.object().shape({
  company_name: yup.string().required('기업명을 입력해주세요.'),
  business_id: yup
    .string()
    .matches(/^\d{10}$/, '사업자번호 형식은 10자리 번호입니다.')
    .required('사업자번호를 입력해주세요.'),
  // licensee: yup.string().required('사업자명을 입력해주세요.'),
  open_date: yup
    .date()
    .typeError('유효한 날짜 형식이 아닙니다.')
    .max(new Date(), '개업일은 과거 날이어야합니다.')
    .required('개업일을 선택해주세요.'),
  departments: yup
    .array()
    .of(yup.string().required('부서 항목은 비어 있을 수 없습니다.'))
    .min(1, '부서는 최소 1개 이상 선택해야 합니다.')
    .required('부서 목록은 필수입니다.'),
  company_address: yup.string().required('기업주소를 입력해주세요.'),
  business_email: yup.string().email('유효한 이메일 형식이 아닙니다.').required('이메일을 입력해주세요.'),
  company_tel: yup
    .string()
    .matches(/^\d{2,3}-\d{3,4}-\d{4}$/, '전화번호 형식이 올바르지 않습니다.')
    .required('기업 전화번호를 입력해주세요.'),
});

export const useMasterProfileForm = yup.object().shape({
  department_name: yup.string().required('부서를 선택해주세요.'),
  position_name: yup.string().required('직급을 입력해주세요.'),
  company_email: yup.string().email('유효한 이메일 형식이 아닙니다.').required('회사 이메일을 입력해주세요.'),
  company_phone: yup
    .string()
    .nullable()
    .notRequired()
    .matches(/^\d{2,3}-\d{3,4}-\d{4}$/, { message: '전화번호 형식이 올바르지 않습니다.', excludeEmptyString: true }),
});

// Login validation schema
export const loginSchema = yup.object().shape({
  user_id: yup
    .string()
    .required('아이디를 입력해주세요.')
    .matches(/^[a-zA-Z0-9]{4,12}$/, '아이디는 4~12자의 영문 및 숫자만 가능합니다.'),
  user_pwd: yup.string().required('비밀번호를 입력해주세요.').min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
});
