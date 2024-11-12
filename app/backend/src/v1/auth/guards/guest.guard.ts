import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from '../service/auth.service';

@Injectable()
export class GuestGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractAccessTokenFromHeader(request);

    if (!accessToken) return true;

    return this.authService.validateAccessToken(accessToken).then(
      () => {
        throw new ForbiddenException('Only guests are allowed');
      },
      () => {
        return true;
      },
    );
  }

  private extractAccessTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
