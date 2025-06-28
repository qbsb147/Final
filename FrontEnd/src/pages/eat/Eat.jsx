import React, { useState } from 'react';
import NonCompleteTest from './form/NonCompleteTest';
import userStore from '../../store/userStore';
import CompleteTest from './form/CompleteTest';

const Eat = () => {
  const { body, stress, burnout, tendency } = userStore();
  return <div>{body && stress && burnout && tendency ? <CompleteTest /> : <NonCompleteTest />}</div>;
};

export default Eat;
