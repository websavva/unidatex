import { Container as BaseContainer } from '@vue-email/components';

import { defineStyledEmailComponent } from '@/utils/define-styled-email-component';

export const Container = defineStyledEmailComponent(BaseContainer, {
  margin: '0 auto',
  padding: '44px 42px 32px 42px',
  width: '580px',
  maxWidth: '100%',
  border: '1px solid #d1d1d1',
  borderRadius: '5px'
});
