import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { SignOptions, VerifyOptions } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  sign(
    payload: Record<string, any>,
    secret: string,
    options: SignOptions & { expiresIn: number },
  ) {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) return reject(err);

        resolve(token!);
      });
    });
  }

  verify<P extends Record<string, any> = Record<string, any>>(
    token: string,
    secret: string,
    options: VerifyOptions = {},
  ) {
    return new Promise<P>((resolve, reject) => {
      jwt.verify(token, secret, options, (err, payload) => {
        if (err) return reject(err);

        resolve(payload as P);
      });
    });
  }
}
