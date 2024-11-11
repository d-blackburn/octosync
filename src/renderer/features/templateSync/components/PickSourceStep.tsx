import React, { RefObject, useEffect, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { Grid2 } from '@mui/material';
import _, { Dictionary } from 'lodash';
import { TemplateSyncData } from '../models/templateSyncData';
import { RepositorySelector } from '../../../components/RepositorySelector';
import { Repository } from '../../../../github/repository';
import { useGitHub } from '../../hooks/github';

export interface PickSourceStepProps {
  data: TemplateSyncData;
  formikRef: RefObject<FormikProps<TemplateSyncData>>;
  onSubmit: (data: TemplateSyncData) => void;
}

const PickSourceStep: React.FC<PickSourceStepProps> = ({
  data,
  formikRef,
  onSubmit,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
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
    <Formik initialValues={data} onSubmit={onSubmit} innerRef={formikRef}>
      {({ values, setFieldValue }) => (
        <Grid2 container size="grow">
          <Grid2 size={12}>
            <RepositorySelector
              repositories={repositories}
              selected={values.source ? [values.source] : []}
              onChange={(source) => setFieldValue('source', source[0])}
              loading={loading}
            />
          </Grid2>
        </Grid2>
      )}
    </Formik>
  );
};
export { PickSourceStep };
