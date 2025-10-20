import React from 'react';
import Interactive2 from '../../components/Interactive2';
import {useSimulateClick} from '../../hooks/useSimulateClick';

const Page2: React.FC = () => {
    useSimulateClick()
  return (
    <div>
      <Interactive2 />
    </div>
  );
};

export default Page2;