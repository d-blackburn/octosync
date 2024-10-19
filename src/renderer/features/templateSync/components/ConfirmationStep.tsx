import React, { RefObject, useEffect, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import {
  Avatar,
  CardContent,
  Chip,
  Grid2,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import { CheckOutlined, CloseOutlined } from '@mui/icons-material';
import _, { Dictionary } from 'lodash';
import { TemplateSyncData } from '../models/templateSyncData';
import { TitleDivider } from '../../../components/TitleDivider';
import { Repository } from '../../../../github/repository';

export interface ConfirmationStepProps {
  data: TemplateSyncData;
  formikRef: RefObject<FormikProps<TemplateSyncData>>;
  onSubmit: (data: TemplateSyncData) => void;
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
          <TitleDivider title="Copying templates" />
          <CardContent>
            <List dense>
              <ListItem disableGutters disablePadding>
                <ListItemIcon>
                  {values.syncIssueTemplates ? (
                    <CheckOutlined color="success" />
                  ) : (
                    <CloseOutlined color="error" />
                  )}
                </ListItemIcon>
                <ListItemText>Issue</ListItemText>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <ListItemIcon>
                  {values.syncPullRequestTemplates ? (
                    <CheckOutlined color="success" />
                  ) : (
                    <CloseOutlined color="error" />
                  )}
                </ListItemIcon>
                <ListItemText>Pull Request</ListItemText>
              </ListItem>
            </List>
          </CardContent>
          <TitleDivider title="To destinations" />
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
