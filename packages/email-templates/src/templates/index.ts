import SignUpConfirmation from './SignUpConfirmation.vue';
import PasswordResetConfirmation from './PasswordResetConfirmation.vue';

import type { ExtractComponentProps } from '../types';

export const EMAIL_TEMPLATES = {
  SignUpConfirmation,
  PasswordResetConfirmation,
};

export type EmailTemplateName = keyof typeof EMAIL_TEMPLATES;

export type EmailTemplateProps = {
  [TemplateName in EmailTemplateName]: ExtractComponentProps<
    (typeof EMAIL_TEMPLATES)[TemplateName]
  >;
};
