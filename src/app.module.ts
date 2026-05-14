import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app-config.module';
import { DatabaseModule } from './database/database.module';
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
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { AddressModule } from './address/address.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';

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
    AppConfigModule,
    DatabaseModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') || '1h') as any,
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    CartModule,
    AddressModule,
    OrderModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
