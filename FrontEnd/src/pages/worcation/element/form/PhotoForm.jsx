import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { InputLightGray } from '../../../../styles/Input.styles.js';
import AddButton from '../../../../components/common/AddButton.jsx';
import ImageUploader from '../../../../components/common/ImageUploader.jsx';
import { ButtonBorder } from '../../../../styles/Button.styles.js';

const Form = () => {
  const [officeImages, setOfficeImages] = useState([]);
  const [stayImages, setStayImages] = useState([]);
  const [officeVisited, setOfficeVisited] = useState(true);
  const [stayVisited, setStayVisited] = useState(true);

  const handleOfficeAddClick = () => {
    if (officeImages.length < 2) {
      setOfficeImages((prev) => [...prev, { id: Date.now() }]);
      setOfficeVisited(true);
    } else {
      setOfficeImages((prev) => [...prev, { id: Date.now() }]);
      setOfficeVisited(false);
    }
  };

  const handleStayAddClick = () => {
    if (stayImages.length < 2) {
      setStayImages((prev) => [...prev, { id: Date.now() }]);
      setStayVisited(true);
    } else {
      setStayImages((prev) => [...prev, { id: Date.now() }]);
      setStayVisited(false);
    }
  };

  const handleOfficeDelete = (id) => {
    setOfficeImages((prev) => prev.filter((image) => image.id !== id));
    setOfficeVisited(true);
  };

  const handleStayDelete = (id) => {
    setStayImages((prev) => prev.filter((image) => image.id !== id));
    setStayVisited(true);
  };

  return (
    <Body>
      <Title>사진을 추가해주세요.(각 최대 4개)</Title>
      <Table>
        <TBody>
          <TR>
            <TH>오피스 사진</TH>
            <TD>
              <ImageUploader label="메인 사진" />
              {officeImages.map((image) => (
                <ImageUploader key={image.id} label="추가 사진" onDelete={() => handleOfficeDelete(image.id)} />
              ))}
              {officeVisited && (
                <AddContainer onClick={handleOfficeAddClick}>
                  <AddButton />
                  <p>사진 추가</p>
                </AddContainer>
              )}
            </TD>
          </TR>
          <TR>
            <TH>숙소 사진</TH>
            <TD>
              <ImageUploader label="메인 사진" />
              {stayImages.map((image) => (
                <ImageUploader key={image.id} label="추가 사진" onDelete={() => handleStayDelete(image.id)} />
              ))}
              {stayVisited && (
                <AddContainer onClick={handleStayAddClick}>
                  <AddButton />
                  <p>사진 추가</p>
                </AddContainer>
              )}
            </TD>
          </TR>
        </TBody>
      </Table>
    </Body>
  );
};

export default Form;

const AddContainer = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  p {
    color: ${({ theme }) => theme.colors.gray[500]};
  }
  cursor: pointer;
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
  border-spacing: 16px 12px;
`;
const TBody = styled.tbody`
  display: flex;
  flex-direction: column;
  gap: 42px;
`;

const TR = styled.tr`
  vertical-align: middle;
  display: flex;
  align-items: center;
`;

const TH = styled.th`
  text-align: left;
  vertical-align: middle;
  width: 200px;
  font-weight: 500;
  margin-bottom: 40px;
`;

const TD = styled.td`
  display: flex;
  gap: 30px;
  align-items: flex-start;
`;
