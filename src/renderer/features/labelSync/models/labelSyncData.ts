import {
  BaseSyncData,
  baseSyncDataInitialState,
} from '../../baseSync/models/baseSyncData';

export type LabelSyncData = BaseSyncData & {};

export const labelSyncDataInitialState: LabelSyncData = {
  ...baseSyncDataInitialState,
};
