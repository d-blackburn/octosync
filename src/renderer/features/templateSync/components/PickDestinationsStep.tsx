import React, { RefObject, useEffect, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { Grid2 } from '@mui/material';
import _, { Dictionary } from 'lodash';
import { TemplateSyncData } from '../models/templateSyncData';
import { RepositorySelector } from '../../../components/RepositorySelector';
import { Repository } from '../../../../github/repository';
import { useGitHub } from '../../hooks/github';

export interface PickDestinationsStepProps {
  data: TemplateSyncData;
  formikRef: RefObject<FormikProps<TemplateSyncData>>;
  onSubmit: (data: TemplateSyncData) => void;
}

const PickDestinationsStep: React.FC<PickDestinationsStepProps> = ({
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
      .then((repos) => {
        setRepositories(_.groupBy(repos, 'owner.login'));
      })
      .catch(() => console.error('Unable to retrieve repositories for User'))
      .finally(() => setLoading(false));
  }, [getAllReposForUser, formikRef, data]);

  return (
    <Formik initialValues={data} onSubmit={onSubmit} innerRef={formikRef}>
      {({ values, setFieldValue }) => (
        <Grid2 container size="grow">
          <Grid2 size={12}>
            <RepositorySelector
              repositories={repositories}
              selected={values.destinations}
              onChange={(destinations) =>
                setFieldValue('destinations', destinations)
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
