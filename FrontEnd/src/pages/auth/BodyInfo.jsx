import React from 'react';
import styled from 'styled-components';
import Input from '../../styles/Input';
import btn from '../../styles/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useBodyForm } from '../../hooks/useBody';
import { ErrorMessage } from '../../styles/Auth.styles';

const BodyInfo = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(useBodyForm),
    mode: 'onChange',
  });

  return (
    <>
      <Content>
        <TitleBox>
          <Title>나의 신체 정보</Title>
        </TitleBox>
        <Form>
          <Box>
            <InputGroup>
              <InputName>몸무게(kg)</InputName>
              {errors.weight && <ErrorMessage>{errors.weight.message}</ErrorMessage>}
              <InputText
                style={Input.InputGray}
                type="number"
                step="0.1"
                min="1"
                max="200"
                placeholder="예: 70.5"
                {...register('weight')}
              />
            </InputGroup>
            <InputGroup>
              <InputName>키(cm)</InputName>
              {errors.height && <ErrorMessage>{errors.height.message}</ErrorMessage>}
              <InputText
                style={Input.InputGray}
                type="number"
                step="0.1"
                min="1"
                max="250"
                placeholder="예: 175.2"
                {...register('height')}
              />
            </InputGroup>
            <InputGroup>
              <InputName>체질량지수(BMI) (15.0 ~ 40.0)</InputName>
              {errors.bmi && <ErrorMessage>{errors.bmi.message}</ErrorMessage>}
              <InputText
                style={Input.InputGray}
                type="number"
                step="0.1"
                min="15"
                max="40"
                placeholder="예: 22.5"
                {...register('bmi')}
              />
            </InputGroup>
            <InputGroup>
              <InputName>혈압 수치(수축기/이완기)</InputName>
              {errors.blood_pressure && <ErrorMessage>{errors.blood_pressure.message}</ErrorMessage>}
              <InputText style={Input.InputGray} type="text" placeholder="예: 120/80" {...register('blood_pressure')} />
            </InputGroup>
            <InputGroup>
              <InputName>혈당 수치(mg/dL)</InputName>
              {errors.blood_sugar && <ErrorMessage>{errors.blood_sugar.message}</ErrorMessage>}
              <InputText
                style={Input.InputGray}
                type="number"
                step="0.1"
                min="0"
                placeholder="예: 90.5"
                {...register('blood_sugar')}
              />
            </InputGroup>
          </Box>
          <Box>
            <InputGroup>
              <InputName>콜레스테롤 수치(mg/dL)</InputName>
              {errors.cholesterol_level && <ErrorMessage>{errors.cholesterol_level.message}</ErrorMessage>}
              <InputText
                style={Input.InputGray}
                type="number"
                min="150"
                max="300"
                placeholder="예: 200"
                {...register('cholesterol_level')}
              />
            </InputGroup>
            <InputGroup>
              <InputName>흡연 습관</InputName>
              {errors.smoking_status && <ErrorMessage>{errors.smoking_status.message}</ErrorMessage>}
              <Select style={Input.InputGray} {...register('smoking_status')}>
                <option value="">선택하세요</option>
                <option value="Non-Smoker">비흡연</option>
                <option value="Smoker">흡연</option>
              </Select>
            </InputGroup>
            <InputGroup>
              <InputName>음주 수준</InputName>
              {errors.alcohol_consumption && <ErrorMessage>{errors.alcohol_consumption.message}</ErrorMessage>}
              <Select style={Input.InputGray} {...register('alcohol_consumption')}>
                <option value="">선택하세요</option>
                <option value="None">전혀 안 마심</option>
                <option value="Low">적음</option>
                <option value="Moderate">중간</option>
                <option value="High">많음</option>
              </Select>
            </InputGroup>
            <InputGroup>
              <InputName>신체 활동 수준</InputName>
              {errors.physical_activity && <ErrorMessage>{errors.physical_activity.message}</ErrorMessage>}
              <Select style={Input.InputGray} {...register('physical_activity')}>
                <option value="">선택하세요</option>
                <option value="Low">낮음</option>
                <option value="Moderate">중간</option>
                <option value="High">높음</option>
              </Select>
            </InputGroup>
            <InputGroup>
              <InputName>평균 수면 시간(4.0~10.0시간)</InputName>
              {errors.sleep_hours && <ErrorMessage>{errors.sleep_hours.message}</ErrorMessage>}
              <InputText
                style={Input.InputGray}
                type="number"
                step="any"
                min="4"
                max="10"
                placeholder="예: 7.5"
                {...register('sleep_hours')}
              />
            </InputGroup>
            <InputGroup>
              <InputName>스트레스 수준(1~10)</InputName>
              {errors.stress_level && <ErrorMessage>{errors.stress_level.message}</ErrorMessage>}
              <InputText
                style={Input.InputGray}
                type="number"
                min="1"
                max="10"
                placeholder="예: 5"
                {...register('stress_level')}
              />
            </InputGroup>
          </Box>
          <Box>
            <InputGroup>
              <InputName>식단 유형</InputName>
              {errors.diet_type && <ErrorMessage>{errors.diet_type.message}</ErrorMessage>}
              <Select style={Input.InputGray} {...register('diet_type')}>
                <option value="">선택하세요</option>
                <option value="Balanced">균형</option>
                <option value="High Carb">고탄수화물</option>
                <option value="High Protein">고단백질</option>
                <option value="Vegan">비건</option>
              </Select>
            </InputGroup>

            <InputGroup>
              <InputName>건강 상태</InputName>
              {errors.health_condition && <ErrorMessage>{errors.health_condition.message}</ErrorMessage>}
              <Select style={Input.InputGray} {...register('health_condition')}>
                <option value="">선택하세요</option>
                <option value="Healthy">건강함</option>
                <option value="Diabetes">당뇨</option>
                <option value="Hypertension">고혈압</option>
                <option value="Obesity">비만</option>
                <option value="Cardiac Issues">심장 질환</option>
              </Select>
            </InputGroup>
          </Box>
        </Form>
        <ButnContent>
          <ButnBox>
            <button style={btn.buttonYbShadow}>취소</button>
            <button style={btn.buttonWbShadow}>완료</button>
          </ButnBox>
        </ButnContent>
      </Content>
    </>
  );
};

const Select = styled.select`
  width: 250px;
  height: 35px;
`;
const ButnContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButnBox = styled.div`
  width: 200px;
  display: flex;
  justify-content: space-between;
`;

const InputText = styled.input`
  width: 250px;
  height: 35px;
`;

const Box = styled.div``;

const InputGroup = styled.div`
  height: 90px;
`;

const Form = styled.form`
  display: flex;
  padding-top: 20px;
  justify-content: space-around;
`;

const Content = styled.div`
  width: 1100px;
  padding-left: 30px;
`;

const TitleBox = styled.div`
  display: flex;
  justify-content: left;
  width: 100%;
`;

const Title = styled.p`
  font-size: ${({ theme }) => theme.fontSizes[`4xl`]};
`;

const InputName = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-family: ${({ theme }) => theme.fontFamily.secondary};
  display: flex;
  justify-content: left;
`;

export default BodyInfo;
