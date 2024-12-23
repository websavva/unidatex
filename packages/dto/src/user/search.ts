import { z } from 'zod';

import { userCountry } from './fields';

export const UsersSearchParamsDtoSchema = z.object({
  country: userCountry(),
})
