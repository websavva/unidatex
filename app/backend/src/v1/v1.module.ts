import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { extractModulesFromRoutes } from '@/shared/utils/extract-modules-from-routes';

import { v1Routes } from './routes';

@Module({
  imports: [
    ...extractModulesFromRoutes(v1Routes),
    RouterModule.register(v1Routes),
  ],
})
export class V1Module {}
