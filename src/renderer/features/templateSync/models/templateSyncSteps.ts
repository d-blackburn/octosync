import { ProcessStep } from '../../../../models/wizards/processStep';
import { PickSourceStep } from '../components/PickSourceStep';
import { PickDestinationsStep } from '../components/PickDestinationsStep';
import { ConfigureOptionsStep } from '../components/ConfigureOptionsStep';
import { ConfirmationStep } from '../components/ConfirmationStep';

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
