import { IsNotEmpty, IsEnum } from 'class-validator';
import { PaymentMethod } from 'database/generated/prisma/enums';

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

// Import PaymentStatus for the DTO
import { PaymentStatus } from 'database/generated/prisma/enums';
