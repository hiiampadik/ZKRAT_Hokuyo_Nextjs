import React from 'react';
import Interactive4 from '../../components/Interactive4';
import {useSimulateClick} from '../../hooks/useSimulateClick';

const Page4: React.FC = () => {
    useSimulateClick()
  return (
    <div>
      <Interactive4 />
    </div>
  );
};

export default Page4;