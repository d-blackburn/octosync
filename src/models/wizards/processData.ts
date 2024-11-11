import { ProcessState } from './processState';

export type ProcessData<T> = {
  data: T;
  states: ProcessState[];
};
