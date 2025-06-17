import React, { useState } from 'react';
import NonCompleteTest from './components/NonCompleteTest';
import eatStore from '../../store/eatStore';
import CompleteTest from './components/CompleteTest';

const Eat = () => {
  const { body, brain } = eatStore();
  return <div>{body && brain ? <NonCompleteTest /> : <CompleteTest />}</div>;
};

export default Eat;
