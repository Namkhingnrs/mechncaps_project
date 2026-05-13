import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TypedConfigService } from '../../../config/typed-config.service';

@Injectable()
export class BcryptService {
  constructor(private readonly configService: TypedConfigService) {}

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.configService.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
