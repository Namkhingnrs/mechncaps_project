import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthTokenService } from '../shared/security/services/auth-token.service';
import { BcryptService } from '../shared/security/services/bcrypt.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, AuthTokenService, BcryptService],
})
export class AuthModule {}
