import React, { useCallback, useState } from 'react';
import { Container } from '@mui/material';
import { ProcessWizard } from '../components/ProcessWizard';
import { LabelSyncData } from '../features/labelSync/models/labelSyncData';
import { LabelSyncProcess } from '../features/labelSync/components/LabelSyncProcess';
import { labelSyncSteps } from '../features/labelSync/models/labelSyncSteps';

const LabelSync: React.FC = () => {
  const [data, setData] = useState<LabelSyncData | null>(null);

  const handleCompletion = useCallback(
    (d: LabelSyncData) => {
      setData(d);
    },
    [setData],
  );

  const handleRestart = useCallback(() => {
    setData(null);
  }, [setData]);

  return (
    <Container
      maxWidth={data === null ? 'md' : 'sm'}
      sx={{ alignContent: 'center', flexGrow: 1 }}
    >
      {data === null ? (
        <ProcessWizard steps={labelSyncSteps} onComplete={handleCompletion} />
      ) : (
        <LabelSyncProcess data={data} onRestart={handleRestart} />
      )}
    </Container>
  );
};
export { LabelSync };
