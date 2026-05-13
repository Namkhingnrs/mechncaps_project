import { Expose, Type } from 'class-transformer';
import { OrderStatus } from 'database/generated/prisma/enums';

export class OrderItemResponseDto {
  @Expose()
  id!: number;

  @Expose()
  productId!: number;

  @Expose()
  productName!: string;

  @Expose()
  quantity!: number;

  @Expose()
  price!: number;

  @Expose()
  total!: number;
}

export class OrderResponseDto {
  @Expose()
  id!: number;

  @Expose()
  userId!: number;

  @Expose()
  addressId!: number;

  @Expose()
  status!: OrderStatus;

  @Expose()
  totalAmount!: number;

  @Expose()
  @Type(() => OrderItemResponseDto)
  items!: OrderItemResponseDto[];

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
