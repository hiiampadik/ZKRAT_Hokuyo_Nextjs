import React from 'react';
import {useSimulateClick} from '../../hooks/useSimulateClick';
import Interactive6 from '../../components/Interactive6';

const Page6: React.FC = () => {
    useSimulateClick()
  return (
    <div>
      <Interactive6 />
    </div>
  );
};

export default Page6;