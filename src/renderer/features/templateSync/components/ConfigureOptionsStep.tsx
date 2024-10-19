import React, { RefObject } from 'react';
import { Formik, FormikProps } from 'formik';
import {
  Grid2,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { TemplateSyncData } from '../models/templateSyncData';
import { configureOptionsStepValidationSchema } from '../schemas/configureOptionsStepValidationSchema';

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
    <Formik
      initialValues={data}
      onSubmit={onSubmit}
      innerRef={formikRef}
      validationSchema={configureOptionsStepValidationSchema}
    >
      {({ values, setFieldValue, touched, errors }) => (
        <Grid2 container size={12} spacing={1} justifyContent="center">
          <Grid2 size={12}>
            <ToggleButtonGroup orientation="vertical" color="primary">
              <ToggleButton
                selected={values.syncIssueTemplates}
                value="Issue Templates"
                onClick={() =>
                  setFieldValue(
                    'syncIssueTemplates',
                    !values.syncIssueTemplates,
                  )
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
          {touched && Boolean(errors) && (
            <Grid2>
              <Typography color="error">{errors.syncIssueTemplates}</Typography>
            </Grid2>
          )}
        </Grid2>
      )}
    </Formik>
  );
};
export { ConfigureOptionsStep };
