import { ProcessStatus } from './processStatus';

export type ProcessState = {
  id: number;
  key?: string;
  status: ProcessStatus;
  message: string;
  url?: string;
};
