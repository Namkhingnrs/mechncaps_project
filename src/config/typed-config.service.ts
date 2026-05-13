import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validateEnv, EnvConfig } from './env.validation';

@Injectable()
export class TypedConfigService {
  constructor(private readonly configService: ConfigService) {}

  get env(): EnvConfig {
    return validateEnv(
      this.configService as unknown as Record<string, unknown>,
    );
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
