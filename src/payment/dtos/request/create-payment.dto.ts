import { IsNotEmpty, IsEnum } from 'class-validator';
import { PaymentMethod, PaymentStatus } from 'database/generated/prisma/enums';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;
}

export class UpdatePaymentStatusDto {
  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status!: PaymentStatus;
}
