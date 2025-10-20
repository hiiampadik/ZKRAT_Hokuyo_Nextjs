import React from 'react';
import Interactive5 from '../../components/Interactive5';
import {useSimulateClick} from '../../hooks/useSimulateClick';

const Page5: React.FC = () => {
    useSimulateClick()
  return (
    <div>
      <Interactive5 />
    </div>
  );
};

export default Page5;