import * as yup from 'yup';

// 신체 정보 입력 폼 validation schema
export const useBodyForm = yup.object().shape({
  height: yup
    .number()
    .typeError('키는 숫자여야 합니다.')
    .min(1, '키는 1cm 이상이어야 합니다.')
    .required('키를 입력해주세요.'),
  weight: yup
    .number()
    .typeError('몸무게는 숫자여야 합니다.')
    .min(1, '몸무게는 1kg 이상이어야 합니다.')
    .required('몸무게를 입력해주세요.'),
  bmi: yup
    .number()
    .typeError('BMI는 숫자여야 합니다.')
    .min(15, 'BMI는 15.0 이상이어야 합니다.')
    .max(40, 'BMI는 40.0 이하여야 합니다.')
    .required('BMI를 입력해주세요.'),
  blood_pressure: yup
    .string()
    .matches(/^\d{2,3}\/\d{2,3}$/, '혈압은 "수축기/이완기" 형식(예: 120/80)으로 입력해주세요.')
    .required('혈압 수치를 입력해주세요.'),
  blood_sugar: yup
    .number()
    .typeError('혈당 수치는 숫자여야 합니다.')
    .min(0, '혈당 수치는 0 이상이어야 합니다.')
    .test('소수점1자리', '혈당 수치는 소수점 1자리까지 입력 가능합니다.', v => v === undefined || /^\d+(\.\d{1})?$/.test(String(v)))
    .required('혈당 수치를 입력해주세요.'),
  cholesterol_level: yup
    .number()
    .typeError('콜레스테롤 수치는 숫자여야 합니다.')
    .min(150, '콜레스테롤 수치는 150 이상이어야 합니다.')
    .max(300, '콜레스테롤 수치는 300 이하여야 합니다.')
    .required('콜레스테롤 수치를 입력해주세요.'),
  smoking_status: yup
    .string()
    .oneOf(['Non-Smoker', 'Smoker'], '흡연 습관을 선택해주세요.')
    .required('흡연 습관을 선택해주세요.'),
  alcohol_consumption: yup
    .string()
    .oneOf(['None', 'Low', 'Moderate', 'High'], '음주 수준을 선택해주세요.')
    .required('음주 수준을 선택해주세요.'),
  physical_activity: yup
    .string()
    .oneOf(['Low', 'Moderate', 'High'], '신체 활동 수준을 선택해주세요.')
    .required('신체 활동 수준을 선택해주세요.'),
  sleep_hours: yup
    .number()
    .typeError('수면 시간은 숫자여야 합니다.')
    .min(4, '수면 시간은 4.0시간 이상이어야 합니다.')
    .max(10, '수면 시간은 10.0시간 이하여야 합니다.')
    .required('평균 수면 시간을 입력해주세요.'),
  diet_type: yup
    .string()
    .oneOf(['Balanced', 'High Carb', 'High Protein', 'Vegan'], '식단 유형을 선택해주세요.')
    .required('식단 유형을 선택해주세요.'),
  health_condition: yup
    .string()
    .oneOf(['Healthy', 'Diabetes', 'Hypertension', 'Obesity', 'Cardiac Issues'], '건강 상태를 선택해주세요.')
    .required('건강 상태를 선택해주세요.'),
});

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
