import { Controller, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@/v1/auth/guards/auth.guard';

@Controller()
@UseGuards(AuthGuard)
export class ChatsController {}
