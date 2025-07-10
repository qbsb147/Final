import React from 'react';
import styled from 'styled-components';
import { ko } from 'date-fns/locale';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';
import {
  useSplitFieldProps,
  useParsedFormat,
  usePickerContext,
} from '@mui/x-date-pickers/hooks';
import { CalendarIcon } from '@mui/x-date-pickers/icons';
import dayjs from 'dayjs';

const Wrapper = styled.div`
  width: 100%;
  .MuiInputBase-root {
    background: #f3f3f3;
    border-radius: 10px;
    border: 1px solid #ffeb8c;
    color: black;
    font-family: inherit;
  }
  .MuiOutlinedInput-input {
    padding: 10px 14px;
  }
  .MuiInputBase-root:hover {
    border: 1px solid #ffeb8c !important;
    outline: none !important;
  }
`;

const StyledTextField = styled(TextField)`
  .MuiInputBase-root,
  .MuiInputBase-root:focus,
  .MuiInputBase-root.Mui-focused,
  .MuiOutlinedInput-root,
  .MuiOutlinedInput-root:focus,
  .MuiOutlinedInput-root.Mui-focused {
    ${({ $variant }) =>
      $variant === 'application'
        ? `
          width: 200px !important;
          border: 1px solid #e5e7eb !important;
          box-shadow: none !important;
          height: 30px !important;
          background: #f3f3f3 important;
          border-radius: 4px !important;
          
  }
        `
        : `
          width: 400px !important;
          border: 3px solid #ffeb8c !important;
          box-shadow: 4px 4px 4px 0 rgba(0,0,0,0.25) !important;
          height: 52.41px !important;
          background: #fff !important;
          border-radius: 10px !important;
        `
    }
    color: black !important;
    font-family: inherit;
  }
  .MuiOutlinedInput-notchedOutline {
    border: none !important;
  }
  .MuiOutlinedInput-input {
    padding: 10px 14px !important;
  }
`;

const CustomDatePicker = ({ selected, onChange, variant = 'yellow' }) => (
  <Wrapper>
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
      <DatePicker
        value={selected}
        onChange={onChange}
        views={['year', 'month', 'day']}
        format="yyyy년 MM월 dd일"
        slots={{
          field: (fieldProps) => <ReadOnlyDateField {...fieldProps} variant={variant} />,
        }}
        slotProps={{
          toolbar: { hidden: true },
          calendarHeader: { format: 'yyyy/MM' },
          textField: {
            placeholder: '날짜를 선택해주세요',
            size: 'small',
          },
        }}
      />
    </LocalizationProvider>
  </Wrapper>
);

function convertFormat(format) {
  // MUI/DateFns 스타일 → dayjs 스타일로 변환
  return format
    .replace(/yyyy/g, 'YYYY')
    .replace(/dd/g, 'DD');
}

function ReadOnlyDateField(props) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const { variant: _variant, ...restForwardedProps } = forwardedProps;

  const pickerContext = usePickerContext();
  const parsedFormat = useParsedFormat();
  const { hasValidationError } = useValidation({
    validator: validateDate,
    value: pickerContext.value,
    timezone: pickerContext.timezone,
    props: internalProps,
  });

  return (
    <StyledTextField
      {...restForwardedProps}
      $variant={props.variant}
      value={
        pickerContext.value == null
          ? ''
          : dayjs(pickerContext.value).format(
              convertFormat(pickerContext.fieldFormat || 'YYYY-MM-DD')
            )
      }
      placeholder={parsedFormat}
      InputProps={{
        ref: pickerContext.triggerRef,
        readOnly: true,
        endAdornment: <CalendarIcon color="action" />,
        sx: { cursor: 'pointer', '& *': { cursor: 'inherit' } },
      }}
      error={hasValidationError}
      focused={pickerContext.open}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
      className={pickerContext.rootClassName}
      sx={pickerContext.rootSx}
      ref={pickerContext.rootRef}
      name={pickerContext.name}
      label={pickerContext.label}
    />
  );
}
export default CustomDatePicker;
