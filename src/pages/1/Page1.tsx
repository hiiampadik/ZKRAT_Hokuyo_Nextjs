import React from 'react';
import Interactive from '../../components/Interactive';
import {useSimulateClick} from '../../hooks/useSimulateClick';

const Page1: React.FC = () => {
    useSimulateClick()
  return (
    <div>
      <Interactive />
    </div>
  );
};

export default Page1;