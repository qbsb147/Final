import React, { useState } from 'react';
import NonCompleteTest from './NonCompleteTest';
import userStore from '../../store/userStore';
import CompleteTest from './CompleteTest';

const Eat = () => {
  const { body, stress, burnout, tendency } = userStore();
  return <div>{body && stress && burnout && tendency ? <CompleteTest /> : <NonCompleteTest />}</div>;
};

export default Eat;
