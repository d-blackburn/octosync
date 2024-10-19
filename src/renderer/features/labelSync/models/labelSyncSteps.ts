import { ProcessStep } from '../../../../models/wizards/processStep';
import { ConfirmationStep } from '../components/ConfirmationStep';
import { PickSourceStep } from '../../baseSync/components/PickSourceStep';
import { PickDestinationsStep } from '../../baseSync/components/PickDestinationsStep';

export const labelSyncSteps: ProcessStep[] = [
  {
    label: 'Pick a source',
    description:
      'Pick a single repository from the list you wish the Labels to be copied from.',
    component: PickSourceStep,
  },
  {
    label: 'Choose destinations',
    description:
      'Choose any number of repositories from the list you wish the Labels to be copied to.',
    component: PickDestinationsStep,
  },
  {
    label: 'Confirm',
    description: 'Check and confirm to start the process',
    component: ConfirmationStep,
  },
];
