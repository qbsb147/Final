import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import styled from 'styled-components';
import { InputLightGray } from '../../../../styles/Input.styles';
import CustomSelect from '../../../../components/common/Select';
import NumberInput from '../../../common/NumberInput';
import CustomTextArea from '../../../common/TextArea';
import { ButtonBorder } from '../../../../styles/Button.styles';
import useWorcationStore from '../../../../store/useWorcationStore';
import { useValidation } from '../../../../hooks/useValidation';
import { Controller } from 'react-hook-form';
import { formatPhoneNumber } from '../../../../hooks/useAuth';

const InfoForm = forwardRef((_, ref) => {
  const info = useWorcationStore((state) => state.info);
  const setInfo = useWorcationStore((state) => state.setInfo);
  const { control, getValues } = useValidation(info);

  useImperativeHandle(ref, () => ({
    isValid: () => {
      // policy는 비어도 되고, 나머지는 필수
      const { theme, maxPeople, price, tel } = getValues();
      return !!theme && !!maxPeople && !!price && !!tel;
    },
    getValues,
  }));

  // 언마운트 시 zustand에 저장
  useEffect(() => {
    return () => {
      setInfo(getValues());
    };
  }, []);

  const themeOptions = [
    { value: 'modern', label: '모던' },
    { value: 'eco_friendly', label: '에코 프렌들리' },
    { value: 'quiet', label: '조용한 분위기' },
    { value: 'urban_nature', label: '도심 속 자연' },
    { value: 'camping', label: '캠핑 스타일' },
  ];

  return (
    <Body>
      <Title>기본 정보를 입력해주세요.</Title>
      <Table>
        <TBody>
          <TR>
            <TH>업체 테마</TH>
            <TD>
              <Controller
                name="theme"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    options={themeOptions}
                    value={field.value || ''}
                    onChange={(e) => {
                      field.onChange(e);
                      setInfo({ theme: e.target.value });
                    }}
                  />
                )}
              />
            </TD>
          </TR>
          <TR>
            <TH>최대 인원</TH>
            <TD>
              <Controller
                name="maxPeople"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    value={field.value || ''}
                    maxLength={3}
                    onChange={(val) => {
                      field.onChange(val);
                      setInfo({ maxPeople: val });
                    }}
                    format={false}
                  />
                )}
              />
            </TD>
          </TR>
          <TR>
            <TH>연락처</TH>
            <TD>
              <Controller
                name="tel"
                control={control}
                render={({ field }) => (
                  <InputLightGray
                    {...field}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      field.onChange(formatted);
                      setInfo({ tel: formatted });
                    }}
                    placeholder="연락처를 입력해주세요"
                  />
                )}
              />
            </TD>
          </TR>
          <TR>
            <TH>이용 가격</TH>
            <TD>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    value={field.value || ''}
                    maxLength={8}
                    onChange={(val) => {
                      field.onChange(val);
                      setInfo({ price: val });
                    }}
                    format={true}
                  />
                )}
              />
            </TD>
          </TR>
          <TR>
            <TH>제휴 가격</TH>
            <TD>
              <Controller
                name="policy"
                control={control}
                render={({ field }) => (
                  <PolicyText
                    value={field.value || ''}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setInfo({ ...info, policy: e.target.value });
                    }}
                    rows={5}
                    placeholder="비제휴 시 미입력"
                  />
                )}
              />
            </TD>
          </TR>
        </TBody>
      </Table>
    </Body>
  );
});

export default InfoForm;

const Body = styled.div`
  gap: 40px;
  padding: 40px;
  height: 562px;
  background: ${({ theme }) => theme.colors.white};
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
  display: flex;
  align-items: center;
  text-align: left;
  width: 200px;
  font-weight: 500;
`;

const TD = styled.td`
  display: flex;
`;

const PolicyText = styled.input`
  width: 200px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-family: ${({ theme }) => theme.fontFamily.secondary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.gray[100]};
  resize: none;
  max-height: 36px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.white};
  }

  &::placeholder {
    font-family: ${({ theme }) => theme.fontFamily.secondary};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
`;
