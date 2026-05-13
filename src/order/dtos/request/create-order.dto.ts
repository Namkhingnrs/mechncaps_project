import { IsNotEmpty, IsInt, IsOptional, IsEnum } from 'class-validator';
import { OrderStatus } from 'database/generated/prisma/enums';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsInt()
  addressId!: number;
}

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
