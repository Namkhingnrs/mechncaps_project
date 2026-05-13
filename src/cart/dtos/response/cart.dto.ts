import { ProductDto } from 'product/dtos/response/product.dto';

export class CartItemDto {
  id!: number;
  productId!: number;
  quantity!: number;
  product!: ProductDto;
}

export class CartDto {
  id!: number;
  userId!: number;
  createdAt!: Date;
  items!: CartItemDto[];
  totalPrice!: number;
}
