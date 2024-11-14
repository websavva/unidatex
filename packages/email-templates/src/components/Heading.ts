import { Text } from '@vue-email/components';

import { defineStyledEmailComponent } from '@/utils/define-styled-email-component';

export const Heading = defineStyledEmailComponent(Text, {
  fontSize: '25px',
  lineHeight: '1.3',
  fontWeight: '600',
  color: '#484848',
});
