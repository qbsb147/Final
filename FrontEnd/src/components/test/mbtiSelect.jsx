import styled from 'styled-components';
const MbtiSelect = ({ answers, handleChange, disabled }) => (
  <CheckBox>
    <SelectWrapper>
      <CustomSelectContainer>
        <CustomSelect
          value={answers.mbti_ei || ''}
          onChange={(e) => handleChange('mbti_ei', e.target.value)}
          hasValue={!!answers.mbti_ei}
          disabled={disabled}
        >
          <option value="" disabled>
            선택
          </option>
          <option value="E">E - 외향형</option>
          <option value="I">I - 내향형</option>
        </CustomSelect>
        <SelectIcon>
          <ChevronDown size={16} />
        </SelectIcon>
      </CustomSelectContainer>
    </SelectWrapper>
    <SelectWrapper>
      <CustomSelectContainer>
        <CustomSelect
          value={answers.mbti_ns || ''}
          onChange={(e) => handleChange('mbti_ns', e.target.value)}
          hasValue={!!answers.mbti_ns}
          disabled={disabled}
        >
          <option value="" disabled>
            선택
          </option>
          <option value="N">N - 직관형</option>
          <option value="S">S - 감각형</option>
        </CustomSelect>
        <SelectIcon>
          <ChevronDown size={16} />
        </SelectIcon>
      </CustomSelectContainer>
    </SelectWrapper>
    <SelectWrapper>
      <CustomSelectContainer>
        <CustomSelect
          value={answers.mbti_tf || ''}
          onChange={(e) => handleChange('mbti_tf', e.target.value)}
          hasValue={!!answers.mbti_tf}
          disabled={disabled}
        >
          <option value="" disabled>
            선택
          </option>
          <option value="T">T - 사고형</option>
          <option value="F">F - 감정형</option>
        </CustomSelect>
        <SelectIcon>
          <ChevronDown size={16} />
        </SelectIcon>
      </CustomSelectContainer>
    </SelectWrapper>
    <SelectWrapper>
      <CustomSelectContainer>
        <CustomSelect
          value={answers.mbti_pj || ''}
          onChange={(e) => handleChange('mbti_pj', e.target.value)}
          hasValue={!!answers.mbti_pj}
          disabled={disabled}
        >
          <option value="" disabled>
            선택
          </option>
          <option value="P">P - 인식형</option>
          <option value="J">J - 판단형</option>
        </CustomSelect>
        <SelectIcon>
          <ChevronDown size={16} />
        </SelectIcon>
      </CustomSelectContainer>
    </SelectWrapper>
  </CheckBox>
);

export default MbtiSelect;

// Styled-components
const CheckBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  width: 60%;
`;

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 120px;
`;

const SelectLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 2px;
`;

const CustomSelectContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const CustomSelect = styled.select`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  width: 100%;
  padding: 12px 40px 12px 16px;
  font-size: 14px;
  font-weight: 500;

  background: ${({ hasValue }) => (hasValue ? '#FFFBEB' : '#ffffff')};
  border: 2px solid ${({ hasValue }) => (hasValue ? '#FAD700' : '#e5e7eb')};
  border-radius: 12px;

  color: ${({ hasValue }) => (hasValue ? '#92400e' : '#6b7280')};
  cursor: pointer;
  outline: none;

  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #fad700;
    box-shadow: 0 0 0 3px rgba(250, 215, 0, 0.15);
    background: #fffbeb;
  }

  &:focus {
    border-color: #fad700;
    box-shadow: 0 0 0 3px rgba(250, 215, 0, 0.25);
    background: #fffbeb;
  }

  &:disabled {
    background-color: #f9fafb;
    border-color: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }

  option {
    padding: 8px;
    background: white;
    color: #374151;

    &:disabled {
      color: #9ca3af;
    }
  }
`;

const SelectIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6b7280;
  transition: color 0.2s ease-in-out;

  ${CustomSelectContainer}:hover & {
    color: #fad700;
  }
`;
