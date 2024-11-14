import { Text } from '@vue-email/components';

import { defineStyledEmailComponent } from '@/utils/define-styled-email-component';

export const Heading = defineStyledEmailComponent(Text, {
  fontSize: '18px',
  lineHeight: '1.4',
  color: '#484848',
});
