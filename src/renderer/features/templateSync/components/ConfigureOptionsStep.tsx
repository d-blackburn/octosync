import React, { RefObject } from 'react';
import { Formik, FormikProps } from 'formik';
import { Grid2, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { TemplateSyncData } from '../models/templateSyncData';

export interface ConfigureOptionsStepProps {
  data: TemplateSyncData;
  formikRef: RefObject<FormikProps<TemplateSyncData>>;
  onSubmit: (data: TemplateSyncData) => void;
}

const ConfigureOptionsStep: React.FC<ConfigureOptionsStepProps> = ({
  data,
  formikRef,
  onSubmit,
}) => {
  return (
    <Formik initialValues={data} onSubmit={onSubmit} innerRef={formikRef}>
      {({ values, setFieldValue }) => (
        <Grid2 size={12}>
          <ToggleButtonGroup orientation="vertical" color="primary">
            <ToggleButton
              selected={values.syncIssueTemplates}
              value="Issue Templates"
              onClick={() =>
                setFieldValue('syncIssueTemplates', !values.syncIssueTemplates)
              }
            >
              Issue Templates
            </ToggleButton>
            <ToggleButton
              selected={values.syncPullRequestTemplates}
              value="Pull Request Templates"
              onClick={() =>
                setFieldValue(
                  'syncPullRequestTemplates',
                  !values.syncPullRequestTemplates,
                )
              }
            >
              Pull Request Template
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid2>
      )}
    </Formik>
  );
};
export { ConfigureOptionsStep };
