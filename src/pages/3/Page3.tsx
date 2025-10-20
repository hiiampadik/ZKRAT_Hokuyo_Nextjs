import React from 'react';
import Interactive3 from '../../components/Interactive3';
import {useSimulateClick} from '../../hooks/useSimulateClick';

const Page3: React.FC = () => {
    useSimulateClick()
  return (
    <div>
      <Interactive3 />
    </div>
  );
};

export default Page3;