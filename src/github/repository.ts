import { Endpoints } from '@octokit/types';

export type Repository =
  Endpoints['GET /repos/{owner}/{repo}']['response']['data'];
