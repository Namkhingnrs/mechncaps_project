import { IsNotEmpty, IsInt, IsPositive, Min } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  productId!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class UpdateCartItemDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity!: number;
}
