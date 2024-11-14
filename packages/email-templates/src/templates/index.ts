import { render } from '@vue-email/render';

import SignUpConfirmationTemplate from './SignUpConfirmation.vue';

import type { ExtractComponentProps } from './types';

export const EMAIL_TEMPLATES = {
  SignUpConfirmationTemplate,
};

export type EmailTemplateName = keyof typeof EMAIL_TEMPLATES;

export type TemplateProps = {
  [TemplateName in EmailTemplateName]: ExtractComponentProps<
    (typeof EMAIL_TEMPLATES)[TemplateName]
  >;
};

export const renderEmailTemplate = async <T extends EmailTemplateName>(
  name: T,
  props?: TemplateProps[T],
) => {
  const component = EMAIL_TEMPLATES[name];

  const [html, text] = await Promise.all([
    render(component, props, {
      plainText: false,
    }),
    render(component, props, {
      plainText: true,
    }),
  ]);

  return {
    html,
    text,
  };
};
