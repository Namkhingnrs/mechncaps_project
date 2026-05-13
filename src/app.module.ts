import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypedConfigService } from './config/typed-config.service';
import { PrismaService } from './database/prisma.service';
import { BcryptService } from './shared/security/services/bcrypt.service';
import { AuthTokenService } from './shared/security/services/auth-token.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { GlobalValidationPipe } from './common/pipes/global-validation.pipe';
import { JwtAuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => ({
        PORT: parseInt(config.PORT || '3000', 10),
        DATABASE_URL: config.DATABASE_URL,
        JWT_SECRET: config.JWT_SECRET,
        JWT_EXPIRES_IN: config.JWT_EXPIRES_IN || '1h',
        SALT_ROUNDS: parseInt(config.SALT_ROUNDS || '12', 10),
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (config: TypedConfigService) => ({
        secret: config.jwtSecret,
        signOptions: { expiresIn: config.jwtExpiresIn as any },
      }),
      inject: [TypedConfigService],
    }),
    PassportModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TypedConfigService,
    PrismaService,
    BcryptService,
    AuthTokenService,
    JwtStrategy,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: GlobalValidationPipe,
    },
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
