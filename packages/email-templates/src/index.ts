import { render } from '@vue-email/render';

import {
  type EmailTemplateProps,
  type EmailTemplateName,
  EMAIL_TEMPLATES,
} from './templates';

export * from './templates';

export const renderEmailTemplate = async <T extends EmailTemplateName>(
  name: T,
  props?: EmailTemplateProps[T],
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
