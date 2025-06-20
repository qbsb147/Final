import React, { useState } from 'react';
import NonCompleteTest from './components/NonCompleteTest';
import userStore from '../../store/userStore';
import CompleteTest from './components/CompleteTest';

const Eat = () => {
  const { body, stress, burnout, tendency } = userStore();
  return <div>{body && stress && burnout && tendency ? <CompleteTest /> : <NonCompleteTest />}</div>;
};

export default Eat;
