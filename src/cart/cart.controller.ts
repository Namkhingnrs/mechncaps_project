import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CurrentUser } from 'auth/decorators/current-user.decorator';
import { CartService } from './cart.service';
import { AddToCartDto } from './dtos/request/add-to-cart.dto';
import { UpdateCartItemDto } from './dtos/request/add-to-cart.dto';
import { CartDto } from './dtos/response/cart.dto';
import type { JwtPayload } from 'auth/types/jwt-payload.type';

@Controller('cart')
@UseInterceptors(ClassSerializerInterceptor)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser() user: JwtPayload): Promise<CartDto> {
    return this.cartService.getCart(user.sub);
  }

  @Post('items')
  async addItem(
    @CurrentUser() user: JwtPayload,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartDto> {
    return this.cartService.addItem(user.sub, addToCartDto);
  }

  @Put('items/:cartItemId')
  async updateItem(
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
    @CurrentUser() user: JwtPayload,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartDto> {
    return this.cartService.updateItem(cartItemId, user.sub, updateCartItemDto);
  }

  @Delete('items/:cartItemId')
  async removeItem(
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
    @CurrentUser() user: JwtPayload,
  ): Promise<CartDto> {
    return this.cartService.removeItem(cartItemId, user.sub);
  }
}
