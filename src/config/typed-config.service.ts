import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validateEnv, EnvConfig } from './env.validation';

@Injectable()
export class TypedConfigService {
  constructor(private readonly configService: ConfigService) {}

  get env(): EnvConfig {
    return validateEnv({
      PORT: this.configService.get('PORT'),
      DATABASE_URL: this.configService.get('DATABASE_URL'),
      JWT_SECRET: this.configService.get('JWT_SECRET'),
      JWT_EXPIRES_IN: this.configService.get('JWT_EXPIRES_IN'),
      SALT_ROUNDS: this.configService.get('SALT_ROUNDS'),
    });
  }

  get port(): number {
    return this.env.PORT;
  }

  get databaseUrl(): string {
    return this.env.DATABASE_URL;
  }

  get jwtSecret(): string {
    return this.env.JWT_SECRET;
  }

  get jwtExpiresIn(): string {
    return this.env.JWT_EXPIRES_IN;
  }

  get saltRounds(): number {
    return this.env.SALT_ROUNDS;
  }
}
