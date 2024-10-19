import React, { RefObject, useEffect, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import {
  Avatar,
  CardContent,
  Chip,
  Grid2,
  List,
  ListSubheader,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import _, { Dictionary } from 'lodash';
import { TitleDivider } from '../../../components/TitleDivider';
import { Repository } from '../../../../github/repository';
import { LabelSyncData } from '../models/labelSyncData';

export interface ConfirmationStepProps {
  data: LabelSyncData;
  formikRef: RefObject<FormikProps<LabelSyncData>>;
  onSubmit: (data: LabelSyncData) => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  data,
  formikRef,
  onSubmit,
}) => {
  const [groupedRepositories, setGroupedRepositories] = useState<Dictionary<
    Repository[]
  > | null>();

  useEffect(() => {
    const repos = _.groupBy(data.destinations, 'owner.login');
    setGroupedRepositories(repos);
  }, [data]);

  return (
    <Formik initialValues={data} onSubmit={onSubmit} innerRef={formikRef}>
      {({ values }) => (
        <Paper sx={{ width: '100%' }}>
          <CardContent>
            <Grid2 container alignItems="center" spacing={1}>
              <Grid2>
                <Avatar sx={{ width: 32, height: 32 }}>
                  <img
                    src={values.source?.owner.avatar_url}
                    height="100%"
                    alt="Profile Avatar"
                  />
                </Avatar>
              </Grid2>
              <Grid2 size="grow">
                <Typography variant="body2" color="textSecondary">
                  Source Repository
                </Typography>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  fontWeight="bold"
                >
                  {values.source?.full_name}
                </Typography>
              </Grid2>
            </Grid2>
          </CardContent>
          <TitleDivider title="Copying labels to" />
          <CardContent>
            {groupedRepositories && (
              <Paper>
                <List
                  sx={{
                    width: '100%',
                    maxWidth: 360,
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    maxHeight: 300,
                    '& ul': { padding: 0 },
                  }}
                  subheader={<li />}
                >
                  {Object.entries(groupedRepositories).map(([owner, repos]) => (
                    <li key={owner}>
                      <ul>
                        <ListSubheader>
                          <Toolbar disableGutters>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              <img
                                src={repos[0].owner.avatar_url}
                                height="100%"
                                alt="Profile Avatar"
                              />
                            </Avatar>
                            <Typography marginLeft={1}>{owner}</Typography>
                          </Toolbar>
                        </ListSubheader>
                        <CardContent>
                          <Grid2 container spacing={1}>
                            {repos.map((repo: Repository) => (
                              <Grid2>
                                <Chip label={repo.name} />
                              </Grid2>
                            ))}
                          </Grid2>
                        </CardContent>
                      </ul>
                    </li>
                  ))}
                </List>
              </Paper>
            )}
          </CardContent>
        </Paper>
      )}
    </Formik>
  );
};
export { ConfirmationStep };
