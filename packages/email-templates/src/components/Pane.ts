import { Text } from '@vue-email/components';

import { defineStyledEmailComponent } from '@/utils/define-styled-email-component';

export const Pane = defineStyledEmailComponent(Text, {
  fontSize: '18px',
  lineHeight: '1.4',
  color: '#484848',
  padding: '24px',
  backgroundColor: '#f2f3f3',
  borderRadius: '4px',
});
