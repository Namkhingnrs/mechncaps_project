import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../database/prisma.service';
import { BcryptService } from '../shared/security/services/bcrypt.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, BcryptService],
  exports: [UserService],
})
export class UserModule {}
