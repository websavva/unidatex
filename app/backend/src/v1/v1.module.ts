import { Module } from '@nestjs/common';

import { RouterModule } from '#shared/modules/router.module';

import { v1Routes } from './routes';

@Module({
  imports: [RouterModule.register(v1Routes)],
})
export class V1Module {}
