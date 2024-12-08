import { Routes } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';

export const v1Routes: Routes = [
  {
    path: '/v1',
    children: [
      {
        path: '/auth',
        module: AuthModule,
      },

      {
        path: '/users',
        module: UsersModule,
      },

      {
        path: '/profile',
        module: ProfileModule,
      },
    ],
  },
];
