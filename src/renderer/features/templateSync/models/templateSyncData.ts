import {
  BaseSyncData,
  baseSyncDataInitialState,
} from '../../baseSync/models/baseSyncData';

export type TemplateSyncData = BaseSyncData & {
  syncIssueTemplates: boolean;
  syncPullRequestTemplates: boolean;
};

export const templateSyncDataInitialState: TemplateSyncData = {
  ...baseSyncDataInitialState,
  syncIssueTemplates: false,
  syncPullRequestTemplates: false,
};
