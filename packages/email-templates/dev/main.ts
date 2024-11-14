import { createApp, h } from 'vue';
import {
  RouterView,
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import { kebabCase, camelCase, upperFirst } from 'scule';

import { EMAIL_TEMPLATES, EmailTemplateName } from '@/templates';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: {
      render() {
        const templatePageLinks = Object.keys(EMAIL_TEMPLATES).map(
          (rawTemplateName) => {
            const templateName = rawTemplateName.replace(/Template$/, '');

            const slug = kebabCase(templateName);

            return h(
              'li',
              h(
                'a',
                {
                  href: `/${slug}`,
                },
                templateName,
              ),
            );
          },
        );

        return h('ul', templatePageLinks);
      },
    },
  },

  {
    path: '/:templateName',
    component: {
      render() {
        const {
          params: { templateName },
        } = this.$route;

        const formattedTemplateName = upperFirst(camelCase(`${templateName}-template`));

        const EmailTemplateComponent =
          EMAIL_TEMPLATES[formattedTemplateName as EmailTemplateName];

        return h(EmailTemplateComponent, EmailTemplateComponent.defaultProps);
      },
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp({
  render() {
    return h(RouterView);
  },
})
  .use(router)
  .mount('#app');
