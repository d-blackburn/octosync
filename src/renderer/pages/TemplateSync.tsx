import React, { useCallback, useState } from 'react';
import { Container } from '@mui/material';
import { ProcessWizard } from '../components/ProcessWizard';
import { templateSyncSteps } from '../features/templateSync/models/templateSyncSteps';
import { TemplateSyncProcess } from '../features/templateSync/components/TemplateSyncProcess';
import { TemplateSyncData } from '../features/templateSync/models/templateSyncData';

export interface TemplateSyncProps {}

const TemplateSync: React.FC<TemplateSyncProps> = () => {
  const [data, setData] = useState<TemplateSyncData | null>(null);

  const handleCompletion = useCallback(
    (d: TemplateSyncData) => {
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
        <ProcessWizard
          steps={templateSyncSteps}
          onComplete={handleCompletion}
        />
      ) : (
        <TemplateSyncProcess data={data} onRestart={handleRestart} />
      )}
    </Container>
  );
};
export { TemplateSync };
