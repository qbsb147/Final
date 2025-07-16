import React, { useEffect, useState } from 'react';
import NonCompleteTest from './NonCompleteTest';
import CompleteTest from './CompleteTest';
import { mealService } from '../../api/meals';
import { toast } from 'react-toastify';

const Eat = () => {
  const [stress, setStress] = useState('');
  const [burnout, setBurnout] = useState('');
  const [preference, setPreference] = useState('');
  const [body, setBody] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { body, stress, burnout, preference } = await mealService.checked();
        console.log(body, stress, burnout, preference);
        setStress(stress);
        setBurnout(burnout);
        setPreference(preference);
        setBody(body);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      {body && stress && burnout && preference ? (
        <CompleteTest />
      ) : (
        <NonCompleteTest body={body} stress={stress} burnout={burnout} preference={preference} />
      )}
    </div>
  );
};

export default Eat;
