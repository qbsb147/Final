import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { InputLightGray } from '../../../../styles/Input.styles';
import RadioButton from '../../../common/RadioButton.jsx';
import CustomDatePicker from '../../../common/DatePicker';
import { ButtonBorder } from '../../../../styles/Button.styles';
import { handleBusinessValidationResult } from '../../../../hooks/useValidation';
import { Controller, useForm } from 'react-hook-form';
import { formatBusinessNumber } from '../../../../hooks/useAuth';
import { businessApi } from '../../../../api/businessApi.js';
import useWorcationStore from '../../../../store/useWorcationStore';
import useBusinessStore from '../../../../store/useBusinessStore.js';
import { useValidation } from '../../../../hooks/useValidation';

// import { toast } from 'react-toastify';

const Form = () => {
  const [selected, setSelected] = useState('Office');
  const { application, setApplication } = useWorcationStore();
  const { data, result } = useValidation(); // 사업자 진위 확인 결과
  const setIsVerified = useBusinessStore((state) => state.setIsVerified);

  const {
    register,
    control,
    formState: { errors, isSubmitting },
    getValues,
    reset,
  } = useForm({
    defaultValues: application,
  });
  useEffect(() => {
    if (result === 'success') {
      setIsVerified(true); // useEffect로 렌더 이후에만 실행
    }
  }, [result, setIsVerified]);

  // 최초 마운트 시 zustand 상태 → form으로 반영
  useEffect(() => {
    reset(application);
  }, [application, reset]);

  const saveFormData = () => {
    setApplication(getValues());
  };

  const checkBusiness = async () => {
    if (Object.keys(errors).length > 0) {
      alert('입력값을 모두 올바르게 입력해주세요.');
      return;
    }
    const formData = getValues();
    const { business_id, licensee, open_date } = formData;
    // 실제 데이터가 없으므로 무조건 통과처리 --------------
    // try {
    const parsedDate = typeof open_date === 'string' ? new Date(open_date) : open_date;

    const data = await businessApi({ business_id, licensee, open_date: parsedDate });
    if (handleBusinessValidationResult(data)) setApplication({ ...formData, isVerified: true });
    setIsVerified(true);

    // return;
    // } catch (err) {
    // const msg = err.response?.data?.message || err.message || err;
    // toast.error('사업자 진위 확인에 실패했습니다. : ' + msg);
    // return;
    // }
    // 실제 데이터가 없으므로 무조건 통과처리 --------------
  };

  const radioOptions = [
    { value: 'Office', label: '오피스' },
    { value: 'Accommodation', label: '숙박' },
    { value: 'OfficeAndStay', label: '오피스&숙박' },
  ];

  return (
    <Body>
      <Title>호스트 신청을 완료해주세요.</Title>
      <Table>
        <TBody>
          <TR>
            <TH>업체 유형</TH>
            <TD>
              <RadioButton
                options={radioOptions}
                selected={application?.worcation_category || 'Office'}
                onChange={(value) => setApplication({ ...application, worcation_category: value })}
              />
            </TD>
          </TR>
          <TR>
            <TH>사업자명</TH>
            <TD>
              <InputLightGray
                id="licensee"
                type="text"
                {...register('licensee')}
                $error={errors.licensee}
                onChange={(e) => {
                  register('licensee').onChange(e); // react-hook-form에 값 저장
                  setApplication({ ...getValues(), licensee: e.target.value });
                }}
              />
              {errors.licensee && <ErrorMessage>{errors.licensee.message}</ErrorMessage>}
            </TD>
          </TR>
          <TR>
            <TH>상호명</TH>
            <TD>
              <InputLightGray
                id="worcation_name"
                type="text"
                {...register('worcation_name')}
                $error={errors.worcation_name}
                onChange={(e) => {
                  register('worcation_name').onChange(e); // react-hook-form에 값 저장
                  setApplication({ ...getValues(), worcation_name: e.target.value });
                }}
              />
              {errors.worcation_name && <ErrorMessage>{errors.worcation_name.message}</ErrorMessage>}
            </TD>
          </TR>
          <TR>
            <TH>개업일</TH>
            <TD>
              <Controller
                control={control}
                name="open_date"
                render={({ field }) => (
                  <CustomDatePicker
                    selected={field.value || null}
                    onChange={(date) => {
                      field.onChange(date);
                      setApplication({ ...getValues(), open_date: date });
                    }}
                    variant="application"
                  />
                )}
              />
              {errors.open_date && <ErrorMessage>{errors.open_date.message}</ErrorMessage>}
            </TD>
          </TR>
          <TR>
            <TH>사업자등록번호</TH>
            <TD>
              <Controller
                name="business_id"
                control={control}
                render={({ field }) => (
                  <InputLightGray
                    placeholder="사업자등록번호 입력"
                    id="business_id"
                    type="text"
                    value={field.value || ''}
                    onChange={(e) => {
                      const formatted = formatBusinessNumber(e.target.value);
                      field.onChange(formatted);
                      setApplication({ ...getValues(), business_id: formatted });
                    }}
                    $error={errors.business_id}
                  />
                )}
              />
              {errors.business_id && <ErrorMessage>{errors.business_id.message}</ErrorMessage>}
            </TD>
            <TD>
              <ButtonYellow type="button" onClick={checkBusiness} disabled={isSubmitting}>
                {isSubmitting ? '확인 중...' : '진위확인'}
              </ButtonYellow>
            </TD>
          </TR>
        </TBody>
      </Table>
    </Body>
  );
};

export default Form;

const DatePicker = styled(CustomDatePicker)`
  width: 200px;
  height: 30px;
`;

const ButtonYellow = styled(ButtonBorder)`
  height: 30px;
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin-left: 50px;
`;

const Body = styled.div`
  gap: 40px;
  padding: 40px;
  height: 562px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
`;

const Title = styled.div`
  text-align: start;
`;

const Table = styled.table`
  width: 100%;
  border-spacing: 16px 12px; /* 셀 간격 조정 */
`;
const TBody = styled.tbody`
  display: flex;
  flex-direction: column;
  gap: 42px;
`;

const TR = styled.tr`
  vertical-align: middle;
  display: flex;
`;

const TH = styled.th`
  text-align: left;
  vertical-align: middle;
  width: 200px;
  font-weight: 500;
`;

const TD = styled.td`
  display: flex;
`;
const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;
