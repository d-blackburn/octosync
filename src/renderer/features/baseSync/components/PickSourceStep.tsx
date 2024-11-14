import React, { RefObject, useEffect, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { Grid2 } from '@mui/material';
import _, { Dictionary } from 'lodash';
import { RepositorySelector } from '../../../components/RepositorySelector';
import { Repository } from '../../../../github/repository';
import { useGitHub } from '../../../hooks/github';
import { BaseSyncData } from '../models/baseSyncData';
import { pickSourceStepValidationSchema } from '../schemas/pickSourceStepValidationSchema';

export interface PickSourceStepProps {
  data: BaseSyncData;
  formikRef: RefObject<FormikProps<BaseSyncData>>;
  onSubmit: (data: BaseSyncData) => void;
}

const PickSourceStep: React.FC<PickSourceStepProps> = ({
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
      .then((repos) => setRepositories(_.groupBy(repos, 'owner.login')))
      .catch(() => console.error('Unable to retrieve repositories for User'))
      .finally(() => setLoading(false));
  }, [getAllReposForUser]);

  return (
    <Formik
      initialValues={data}
      onSubmit={onSubmit}
      innerRef={formikRef}
      validationSchema={pickSourceStepValidationSchema}
    >
      {({ values, setFieldValue, touched, errors }) => (
        <Grid2 container size="grow">
          <Grid2 size={12}>
            <RepositorySelector
              repositories={repositories}
              selected={values.source ? [values.source] : []}
              onChange={(source) => setFieldValue('source', source[0])}
              error={touched.source && Boolean(errors.source)}
              helperText={touched.source && errors.source}
              loading={loading}
            />
          </Grid2>
        </Grid2>
      )}
    </Formik>
  );
};
export { PickSourceStep };
