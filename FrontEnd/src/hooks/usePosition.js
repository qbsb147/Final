import { useState } from 'react';

export const usePosition = (initialValue = '') => {
  const positions = [
    { position_name: '사원' },
    { position_name: '주임' },
    { position_name: '대리' },
    { position_name: '과장' },
    { position_name: '차장' },
    { position_name: '부장' },
    { position_name: '이사' },
    { position_name: '상무' },
    { position_name: '전무' },
    { position_name: '부사장' },
  ];

  const [positionList, setPositionList] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(initialValue);

  const handlePositionClick = () => {
    setPositionList(positions);
  };

  const handlePositionSelect = (position) => {
    setSelectedPosition(position.position_name);
    setPositionList([]);
  };

  return {
    positionList,
    selectedPosition,
    setSelectedPosition,
    handlePositionClick,
    handlePositionSelect,
  };
}; 