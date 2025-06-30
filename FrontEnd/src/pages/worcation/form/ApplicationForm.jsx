import React, { useState } from 'react';
import styled from 'styled-components';
import { InputLightGray } from '../../../styles/Input.styles.js';
import RadioButton from '../../../components/common/RadioButton.jsx';
import CustomDatePicker from '../../../components/common/DatePicker.jsx';
import { ButtonBorder } from '../../../styles/Button.styles.js';
import { useValidateForm } from '../../../hooks/useValidateForm.js';
import { Controller } from 'react-hook-form';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import useHostStore from '../../../store/useBusinessStore.js';
import useBusinessStore from '../../../store/useBusinessStore';

// const Form = () => {
//   const [selected, setSelected] = useState('Office');

//   const radioOptions = [
//     { value: 'Office', label: '오피스' },
//     { value: 'Accommodation', label: '숙박' },
//     { value: 'OfficeAndStay', label: '오피스&숙박' },
//   ];

//   const { register, control, errors, isSubmitting, getValues } = useValidateForm();

//   const checkBusiness = async () => {
//     const formData = getValues(); // 현재 입력값 전부 가져오기

//     try {
//       const response = await axios.post('/api/business/validate', {
//         b_no: [formData.business_id],
//       });

//       const result = response?.data?.data?.[0];
//       if (result && result.b_stt_cd === '01') {
//         //  정상 사업자일 경우
//         useHostStore.getState().setHostForm({ ...formData, type: selected });
//         alert('사업자 등록번호 확인되었습니다.');
//       } else {
//         alert('유효하지 않은 사업자 등록번호입니다.');
//       }
//     } catch (error) {
//       console.error('사업자 진위확인 실패:', error);
//       alert('사업자 진위확인 중 오류가 발생했습니다.');
//     }
//   };
const Form = () => {
  const [selected, setSelected] = useState('Office');
  const { register, control, errors, isSubmitting, getValues } = useValidateForm();

  const radioOptions = [
    { value: 'Office', label: '오피스' },
    { value: 'Accommodation', label: '숙박' },
    { value: 'OfficeAndStay', label: '오피스&숙박' },
  ];

  const checkBusiness = async () => {
    const formData = getValues(); // useValidateForm 훅의 getValues()

    // 기본 유효성 검사
    if (!formData.business_id || formData.business_id.length !== 10) {
      alert('사업자등록번호는 숫자 10자리를 입력해야 합니다.');
      return;
    }

    // 개업일 날짜 포맷 변환
    let formattedDate = '';
    try {
      if (!(formData.open_date instanceof Date)) {
        formData.open_date = new Date(formData.open_date); // 방어 처리
      }
      formattedDate = format(formData.open_date, 'yyyyMMdd'); // '20240101' 형식
    } catch (e) {
      alert('개업일을 선택해주세요.');
      return;
    }

    // 사업자 요청 데이터 구성
    const businessData = {
      businesses: [
        {
          b_no: formData.business_id.trim(),
          start_dt: formattedDate,
          p_nm: formData.licensee?.trim() || '',
          p_nm2: formData.licensee?.trim() || '',
          b_nm: formData.worcation_name?.trim() || '',
          corp_no: '',
          b_sector: '',
          b_type: '',
          b_adr: '',
        },
      ],
    };

    try {
      const serviceKey = import.meta.env.VITE_ODCLOUD_SERVICE_KEY;
      if (!serviceKey) {
        console.error('serviceKey가 정의되지 않았습니다.');
        return alert('API 키 오류: .env 파일을 확인하세요.');
      }

      const url = `https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=${encodeURIComponent(serviceKey)}`;
      console.log('요청 URL:', url);

      const response = await axios.post(url, businessData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = response?.data?.data?.[0];
      console.log('응답 결과:', result);

      if (result?.b_stt_cd === '01') {
        // 💡 이 부분이 '정상 사업자'일 때만 실행됨
        useBusinessStore.getState().setFormData({
          businessId: formData.business_id,
          licensee: formData.licensee,
          worcationName: formData.worcation_name,
          openDate: formattedDate,
          category: selected, // 업체 유형 (Office 등)
        });
        alert('사업자 등록번호 확인되었습니다.');
      } else {
        alert('유효하지 않은 사업자 등록번호입니다.');
      }
    } catch (error) {
      console.error('사업자 진위확인 실패:', error.response?.data || error.message);
      alert('사업자 진위확인 중 오류가 발생했습니다.');
    }
  };

  return (
    <Body>
      <Title>호스트 신청을 완료해주세요.</Title>
      <Table>
        <TBody>
          <TR>
            <TH>업체 유형</TH>
            <TD>
              <RadioButton options={radioOptions} selected={selected} onChange={setSelected} />
            </TD>
          </TR>
          <TR>
            <TH>사업자명</TH>
            <TD>
              <Input id="licensee" type="text" {...register('licensee')} $error={errors.licensee} />
              {errors.licensee && <ErrorMessage>{errors.licensee.message}</ErrorMessage>}
            </TD>
          </TR>
          <TR>
            <TH>상호명</TH>
            <TD>
              <Input id="worcation_name" type="text" {...register('worcation_name')} $error={errors.worcation_name} />
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
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    $error={errors.open_date}
                  />
                )}
              />
              {errors.open_date && <ErrorMessage>{errors.open_date.message}</ErrorMessage>}
            </TD>
          </TR>
          <TR>
            <TH>사업자등록번호</TH>
            <TD>
              <Input
                placeholder="숫자만 10글자 입력"
                id="business_id"
                type="text"
                {...register('business_id')}
                $error={errors.business_id}
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
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
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
