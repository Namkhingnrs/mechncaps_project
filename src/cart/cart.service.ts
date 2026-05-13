import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'database/prisma.service';
import { AddToCartDto } from './dtos/request/add-to-cart.dto';
import { UpdateCartItemDto } from './dtos/request/add-to-cart.dto';
import { CartDto, CartItemDto } from './dtos/response/cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: number): Promise<CartDto> {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });
    }

    const totalPrice = cart.items.reduce((total: number, item: any) => {
      return total + item.product.price * item.quantity;
    }, 0);

    return {
      id: cart.id,
      userId: cart.userId,
      createdAt: cart.createdAt,
      items: cart.items.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          stock: item.product.stock,
          material: item.product.material,
          profile: item.product.profile,
          imageUrl: item.product.imageUrl,
          createdAt: item.product.createdAt,
          category: {
            id: item.product.category.id,
            name: item.product.category.name,
          },
        },
      })),
      totalPrice,
    };
  }

  async addItem(userId: number, addToCartDto: AddToCartDto): Promise<CartDto> {
    const { productId, quantity } = addToCartDto;

    // Verify product exists and has stock
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException({
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    if (product.stock < quantity) {
      throw new BadRequestException({
        message: 'Insufficient stock',
        code: 'INSUFFICIENT_STOCK',
      });
    }

    // Get or create cart
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      // Update quantity
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Create new item
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return this.getCart(userId);
  }

  async updateItem(
    cartItemId: number,
    userId: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartDto> {
    const { quantity } = updateCartItemDto;

    // Verify cart item exists and belongs to user
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: { userId },
      },
      include: { product: true },
    });

    if (!cartItem) {
      throw new NotFoundException({
        message: 'Cart item not found',
        code: 'CART_ITEM_NOT_FOUND',
      });
    }

    if (cartItem.product.stock < quantity) {
      throw new BadRequestException({
        message: 'Insufficient stock',
        code: 'INSUFFICIENT_STOCK',
      });
    }

    await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return this.getCart(userId);
  }

  async removeItem(cartItemId: number, userId: number): Promise<CartDto> {
    // Verify cart item exists and belongs to user
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: { userId },
      },
    });

    if (!cartItem) {
      throw new NotFoundException({
        message: 'Cart item not found',
        code: 'CART_ITEM_NOT_FOUND',
      });
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return this.getCart(userId);
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }
  }
}
