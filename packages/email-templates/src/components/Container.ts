import { Container as BaseContainer } from '@vue-email/components';

import { defineStyledEmailComponent } from '@/utils/define-styled-email-component';

export const Container = defineStyledEmailComponent(BaseContainer, {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
  maxWidth: '100%',
});
