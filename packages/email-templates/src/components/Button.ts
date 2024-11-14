import { Button as BaseButton } from '@vue-email/components';

import { defineStyledEmailComponent } from '@/utils/define-styled-email-component';

export const Button = defineStyledEmailComponent(BaseButton, {
  backgroundColor: '#0a6972',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '18px',
  paddingTop: '19px',
  paddingBottom: '19px',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'block',
  width: '100%',
});
