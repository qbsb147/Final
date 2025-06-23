import { useCallback } from 'react';
import { step1Schema, step2SchemaTypeA, step2SchemaTypeB, loginSchema } from '../components/auth/authSchemas';

export default function useValidation() {
  const step2Schemas = {
    typeA: step2SchemaTypeA,
    typeB: step2SchemaTypeB,
  };

  // 유효성 검증 함수
  const validateStep = useCallback(async (stepData, step, userType = '') => {
    try {
      if (step === 0) {
        await loginSchema.validate(stepData, { abortEarly: false });
      } else if (step === 1) {
        await step1Schema.validate(stepData, { abortEarly: false });
      } else if (step === 2 && step2Schemas[userType]) {
        await step2Schemas[userType].validate(stepData, { abortEarly: false });
      }
      return true;
      
    } catch (err) {
      if (err.inner && err.inner.length > 0) {
        alert(err.inner[0].message); // 첫 번째 오류만 알림
      } else {
        alert(err.message);
      }
      return false;
    }
  }, []);

  return { validateStep };
}
