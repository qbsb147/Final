import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import styled from 'styled-components';
import { InputLightGray } from '../../../../styles/Input.styles';
import RadioButton from '../../../common/RadioButton.jsx';
import CustomDatePicker from '../../../common/DatePicker';
import { ButtonBorder } from '../../../../styles/Button.styles';
import { handleBusinessValidationResult, useValidation } from '../../../../hooks/useValidation';
import { Controller } from 'react-hook-form';
import { formatBusinessNumber } from '../../../../hooks/useAuth';
import { businessApi } from '../../../../api/businessApi.js';
import useWorcationStore from '../../../../store/useWorcationStore';

// import { toast } from 'react-toastify';

const ApplicationForm = forwardRef((props, ref) => {
  const application = useWorcationStore((state) => state.application);
  const [selected, setSelected] = useState(application.companyType || 'Office');
  const setApplication = useWorcationStore((state) => state.setApplication);
  const { register, control, getValues, errors, isSubmitting, isValid, setValue } = useValidation(application);
  const setInfo = useWorcationStore((state) => state.setInfo);

  useImperativeHandle(ref, () => ({
    getValues,
    isValid,
  }));

  // 마운트 시 zustand에도 기본값 세팅
  useEffect(() => {
    if (!application.companyType) {
      setApplication({ companyType: 'Office' });
    }
  }, [application.companyType, setApplication]);

  useEffect(() => {
    setSelected(application.companyType || 'Office');
  }, [application.companyType]);

  // store의 값이 변경될 때 form 값 동기화 (무한 루프 방지)
  useEffect(() => {
    if (application && Object.keys(application).length > 0) {
      // 한 번만 실행되도록 조건 추가
      const currentValues = getValues();
      if (!currentValues.worcation_name && application.worcation_name) {
        setValue('worcation_name', application.worcation_name || '');
        setValue('business_id', application.business_id || '');
        setValue('licensee', application.licensee || '');
        setValue('open_date', application.open_date || null);
        setValue('companyType', application.companyType || 'Office');
      }
    }
  }, []); // 마운트 시에만 실행

  const checkBusiness = async () => {
    const allValues = getValues();
    const { business_id, licensee, open_date } = allValues;

    if (!business_id || !licensee || !open_date || Object.keys(errors).length > 0) {
      alert('입력값을 모두 올바르게 입력해주세요.');
      return;
    }
    // 실제 데이터가 없으므로 무조건 통과처리 --------------
    // try {
    const data = await businessApi({ business_id, licensee, open_date });
    if (handleBusinessValidationResult(data)) return;
    // } catch (err) {
    // const msg = err.response?.data?.message || err.message || err;
    // toast.error('사업자 진위 확인에 실패했습니다. : ' + msg);
    // return;
    // }
    // 실제 데이터가 없으므로 무조건 통과처리 --------------
  };

  const handleTypeChange = (value) => {
    setSelected(value);
    setApplication({ companyType: value });
    setInfo({ category: value });
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
              <RadioButton options={radioOptions} selected={selected} onChange={handleTypeChange} />
            </TD>
          </TR>
          <TR>
            <TH>사업자명</TH>
            <TD>
              <Input
                id="licensee"
                type="text"
                {...register('licensee', {
                  onChange: (e) => setApplication({ licensee: e.target.value }),
                })}
                $error={errors.licensee}
              />
              {errors.licensee && <ErrorMessage>{errors.licensee.message}</ErrorMessage>}
            </TD>
          </TR>
          <TR>
            <TH>상호명</TH>
            <TD>
              <Input
                id="worcation_name"
                type="text"
                {...register('worcation_name', {
                  onChange: (e) => setApplication({ worcation_name: e.target.value }),
                })}
                $error={errors.worcation_name}
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
                      setApplication({ open_date: date });
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
                  <Input
                    placeholder="사업자등록번호 입력"
                    id="business_id"
                    type="text"
                    value={field.value || ''}
                    onChange={(e) => {
                      field.onChange(formatBusinessNumber(e.target.value));
                      setApplication({ business_id: formatBusinessNumber(e.target.value) });
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
});

export default ApplicationForm;

const Input = styled(InputLightGray)`
  width: 200px;
  height: 30px;
`;

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
