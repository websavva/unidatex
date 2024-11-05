import { randomBytes } from 'node:crypto';

import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptoService {
  generateRandomHash(bytes = 6) {
    return randomBytes(bytes).toString('hex');
  }
}
