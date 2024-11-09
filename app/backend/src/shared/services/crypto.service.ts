import { randomBytes } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

@Injectable()
export class CryptoService {
  generateRandomHash(bytes = 6) {
    return randomBytes(bytes).toString('hex');
  }

  hashifyPassword(password: string) {
    return bcrypt.hash(password, 8);
  }

  comparePassword(plainPassword: string, passwordHash: string) {
    return bcrypt.compare(plainPassword, passwordHash);
  }
}
