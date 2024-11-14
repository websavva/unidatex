import SignUpConfirmationTemplate from './SignUpConfirmation.vue';

import type { ExtractComponentProps } from '../types';

export const EMAIL_TEMPLATES = {
  SignUpConfirmationTemplate,
};

export type EmailTemplateName = keyof typeof EMAIL_TEMPLATES;

export type EmailTemplateProps = {
  [TemplateName in EmailTemplateName]: ExtractComponentProps<
    (typeof EMAIL_TEMPLATES)[TemplateName]
  >;
};
