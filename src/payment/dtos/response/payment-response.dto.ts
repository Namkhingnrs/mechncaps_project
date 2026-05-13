import { Expose } from 'class-transformer';
import { PaymentMethod, PaymentStatus } from 'database/generated/prisma/enums';

export class PaymentResponseDto {
  @Expose()
  id!: number;

  @Expose()
  orderId!: number;

  @Expose()
  method!: PaymentMethod;

  @Expose()
  status!: PaymentStatus;

  @Expose()
  paymentDate!: Date | null;
}
