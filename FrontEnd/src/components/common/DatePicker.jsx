import React from 'react';
import styled from 'styled-components';
import { ko } from 'date-fns/locale';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';
import {
  useSplitFieldProps,
  useParsedFormat,
  usePickerContext,
} from '@mui/x-date-pickers/hooks';
import { CalendarIcon } from '@mui/x-date-pickers/icons';
import dayjs from 'dayjs';

// styled-components 사용 (예시로 래핑한 container)
const Wrapper = styled.div`
  width: 200px; /* 원하는 width */
  .MuiInputBase-root {
    background: #fff;
    border-radius: 10px;
    border: 1px solid #ffeb8c;
    color: black;
    font-family: inherit;
  }
  .MuiOutlinedInput-input {
    padding: 10px 14px;
  }
`;

const getStylesByVariant = (variant) => {
  switch (variant) {
    case 'yellow':
      return {
        width:'200px',
        background: '#fff',
        borderRadius: '10px',
        border: '1px solid #ffeb8c',
        color: 'black',
        '& input': {
          padding: '10px 14px',
        },
      };
    default:
      return {
        width: 400,
        background: '#fff',
        borderRadius: '10px',
        border: '3px solid #ffeb8c',
        boxShadow: '4px 4px 4px rgba(0,0,0,0.25)',
        color: 'black',
        '& input': {
          padding: '10px 14px',
        },
      };
  }
};

const CustomDatePicker = ({ selected, onChange, variant = 'yellow' }) => {
  return (
    <Wrapper>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
        <DatePicker
          value={selected}
          onChange={onChange}
          views={['year', 'month', 'day']}
          format="yyyy년 MM월 dd일"
          slots={{
            field: ReadOnlyDateField
          }
          }
          slotProps={{
            toolbar:{
              hidden:true
            },
            calendarHeader:{
              format: 'yyyy/MM'
            },
            textField: {
              placeholder: '날짜를 선택해주세요',
              size: 'small',
              sx: getStylesByVariant(variant),
            },
          }}
          
        />
      </LocalizationProvider>
    </Wrapper>
  );
};

function convertFormat(format) {
  // MUI/DateFns 스타일 → dayjs 스타일로 변환
  return format
    .replace(/yyyy/g, 'YYYY')
    .replace(/dd/g, 'DD');
}

function ReadOnlyDateField(props) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');

  const pickerContext = usePickerContext();
  const parsedFormat = useParsedFormat();
  const { hasValidationError } = useValidation({
    validator: validateDate,
    value: pickerContext.value,
    timezone: pickerContext.timezone,
    props: internalProps,
  });

  return (
    <TextField
      {...forwardedProps}
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
