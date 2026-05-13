import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'database/prisma.service';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
} from './dtos/request/create-order.dto';
import { OrderResponseDto } from './dtos/response/order-response.dto';
import { OrderStatus } from 'database/generated/prisma/enums';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<OrderResponseDto> {
    // Get user's cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        throw new BadRequestException(
          `Insufficient stock for ${item.product.name}`,
        );
      }
    }

    // Calculate total
    const totalAmount = cart.items.reduce(
      (total: number, item: any) =>
        total + item.quantity * Number(item.product.price),
      0,
    );

    // Verify address belongs to user
    const address = await this.prisma.address.findFirst({
      where: { id: createOrderDto.addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // Create order in transaction
    const order = await this.prisma.$transaction(async (tx: any) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          addressId: createOrderDto.addressId,
          totalPrice: totalAmount,
          status: OrderStatus.PENDING_PAYMENT,
        },
      });

      // Create order items
      const orderItems = cart.items.map((item: any) => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      }));

      await tx.orderItem.createMany({
        data: orderItems,
      });

      // Update product stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return this.findOne(order.id, userId);
  }

  async findAll(userId: number): Promise<OrderResponseDto[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order: any) => ({
      id: order.id,
      userId: order.userId,
      addressId: order.addressId,
      status: order.status,
      totalAmount: Number(order.totalPrice),
      items: order.items.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: Number(item.price),
        total: item.quantity * Number(item.price),
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  }

  async findOne(id: number, userId: number): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      id: order.id,
      userId: order.userId,
      addressId: order.addressId,
      status: order.status,
      totalAmount: Number(order.totalPrice),
      items: order.items.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: Number(item.price),
        total: item.quantity * Number(item.price),
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  async updateStatus(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    userId: number,
  ): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { status: updateOrderStatusDto.status },
    });

    return this.findOne(updatedOrder.id, userId);
  }
}
