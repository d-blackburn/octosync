import React, { RefObject, useEffect, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { Grid2 } from '@mui/material';
import _, { Dictionary } from 'lodash';
import { RepositorySelector } from '../../../components/RepositorySelector';
import { Repository } from '../../../../github/repository';
import { useGitHub } from '../../../hooks/github';
import { BaseSyncData } from '../models/baseSyncData';
import { pickDestinationsStepValidationSchema } from '../schemas/pickDestinationsStepValidationSchema';

export interface PickDestinationsStepProps {
  data: BaseSyncData;
  formikRef: RefObject<FormikProps<BaseSyncData>>;
  onSubmit: (data: BaseSyncData) => void;
}

const PickDestinationsStep: React.FC<PickDestinationsStepProps> = ({
  data,
  formikRef,
  onSubmit,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [repositories, setRepositories] = useState<Dictionary<
    Repository[]
  > | null>(null);

  const { getAllReposForUser } = useGitHub();

  useEffect(() => {
    setLoading(true);
    getAllReposForUser()
      .then((repos) => {
        setRepositories(
          _.groupBy(
            repos.filter((r) => r.id !== data.source?.id),
            'owner.login',
          ),
        );
      })
      .catch(() => console.error('Unable to retrieve repositories for User'))
      .finally(() => setLoading(false));
  }, [getAllReposForUser, formikRef, data]);

  return (
    <Formik
      initialValues={data}
      onSubmit={onSubmit}
      innerRef={formikRef}
      validationSchema={pickDestinationsStepValidationSchema}
    >
      {({ values, setFieldValue, touched, errors }) => (
        <Grid2 container size="grow">
          <Grid2 size={12}>
            <RepositorySelector
              repositories={repositories}
              selected={values.destinations}
              onChange={(destinations) =>
                setFieldValue('destinations', destinations)
              }
              error={touched.destinations && Boolean(errors.destinations)}
              helperText={
                touched.destinations && (errors.destinations as string)
              }
              loading={loading}
              multi
            />
          </Grid2>
        </Grid2>
      )}
    </Formik>
  );
};
export { PickDestinationsStep };
