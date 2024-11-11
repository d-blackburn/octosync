import { Repository } from '../../../../github/repository';

export type TemplateSyncData = {
  source: Repository | null;
  destinations: Repository[];
  syncIssueTemplates: boolean;
  syncPullRequestTemplates: boolean;
};

export const templateSyncDataInitialState: TemplateSyncData = {
  source: null,
  destinations: [],
  syncIssueTemplates: false,
  syncPullRequestTemplates: false,
};
