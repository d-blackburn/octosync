import { ProcessStep } from '../../../../models/wizards/processStep';
import { ConfigureOptionsStep } from '../components/ConfigureOptionsStep';
import { ConfirmationStep } from '../components/ConfirmationStep';
import { PickDestinationsStep } from '../../baseSync/components/PickDestinationsStep';
import { PickSourceStep } from '../../baseSync/components/PickSourceStep';

export const templateSyncSteps: ProcessStep[] = [
  {
    label: 'Pick a source',
    description:
      'Pick a single repository from the list you wish the Issue Templates to be copied from.',
    component: PickSourceStep,
  },
  {
    label: 'Choose destinations',
    description:
      'Choose any number of repositories from the list you wish the Issue Templates to be copied to.',
    component: PickDestinationsStep,
  },
  {
    label: 'Configure options',
    description: 'Pick what you would like to synchronise',
    component: ConfigureOptionsStep,
  },
  {
    label: 'Confirm',
    description: 'Check and confirm to start the process',
    component: ConfirmationStep,
  },
];
