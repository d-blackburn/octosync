import * as Yup from 'yup';

export const pickDestinationsStepValidationSchema = Yup.object().shape({
  destinations: Yup.array().min(1, 'Must select at-least 1 repository'),
});
