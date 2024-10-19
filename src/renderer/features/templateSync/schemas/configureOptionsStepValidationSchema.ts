import * as Yup from 'yup';

export const configureOptionsStepValidationSchema = Yup.object().shape({
  syncIssueTemplates: Yup.boolean().test(
    'atLeastOneTrue',
    'Must select at least one option',
    (value, context) => value || context.parent.syncPullRequestTemplates,
  ),
  syncPullRequestTemplates: Yup.boolean().test(
    'atLeastOneTrue',
    'Must select at least one option',
    (value, context) => value || context.parent.syncIssueTemplates,
  ),
});
