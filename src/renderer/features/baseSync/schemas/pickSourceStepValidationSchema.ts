import * as Yup from 'yup';

export const pickSourceStepValidationSchema = Yup.object().shape({
  source: Yup.mixed().nullable().required('Must select a repository'),
});
