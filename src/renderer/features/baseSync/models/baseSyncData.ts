import { Repository } from '../../../../github/repository';

export type BaseSyncData = {
  source: Repository | null;
  destinations: Repository[];
};

export const baseSyncDataInitialState: BaseSyncData = {
  source: null,
  destinations: [],
};
