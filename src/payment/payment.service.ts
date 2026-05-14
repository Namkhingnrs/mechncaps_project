import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'database/prisma.service';
import {
  CreatePaymentDto,
  UpdatePaymentStatusDto,
} from './dtos/request/create-payment.dto';
import { PaymentResponseDto } from './dtos/response/payment-response.dto';
import {
  PaymentMethod,
  PaymentStatus,
  OrderStatus,
} from 'database/generated/prisma/enums';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    orderId: number,
    createPaymentDto: CreatePaymentDto,
    userId: number,
  ): Promise<PaymentResponseDto> {
    // Check if order exists and belongs to user
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException('Order is not awaiting payment');
    }

    // Check if payment already exists for this order
    const existingPayment = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (existingPayment) {
      throw new BadRequestException('Payment already exists for this order');
    }

    // Create payment
    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        method: createPaymentDto.method,
        status: PaymentStatus.PENDING,
      },
    });

    return {
      id: payment.id,
      orderId: payment.orderId,
      method: payment.method,
      status: payment.status,
      paymentDate: payment.paymentDate,
    };
  }

  async findOne(orderId: number, userId: number): Promise<PaymentResponseDto> {
    // First check if order belongs to user
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return {
      id: payment.id,
      orderId: payment.orderId,
      method: payment.method,
      status: payment.status,
      paymentDate: payment.paymentDate,
    };
  }

  async updateStatus(
    orderId: number,
    updatePaymentStatusDto: UpdatePaymentStatusDto,
    userId: number,
  ): Promise<PaymentResponseDto> {
    // Check if order belongs to user
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Update payment status
    const updatedPayment = await this.prisma.payment.update({
      where: { orderId },
      data: {
        status: updatePaymentStatusDto.status,
        paymentDate:
          updatePaymentStatusDto.status === PaymentStatus.PAID
            ? new Date()
            : null,
      },
    });

    // If payment is completed, update order status
    if (updatePaymentStatusDto.status === PaymentStatus.PAID) {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.WAITING_VERIFICATION },
      });
    }

    if (updatePaymentStatusDto.status === PaymentStatus.FAILED) {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });
    }

    return {
      id: updatedPayment.id,
      orderId: updatedPayment.orderId,
      method: updatedPayment.method,
      status: updatedPayment.status,
      paymentDate: updatedPayment.paymentDate,
    };
  }

  // Simulate payment processing (for demo purposes)
  async processPayment(
    orderId: number,
    userId: number,
  ): Promise<PaymentResponseDto> {
    const payment = await this.findOne(orderId, userId);

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment is not in pending status');
    }

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo, randomly succeed or fail
    const success = Math.random() > 0.2; // 80% success rate

    const newStatus = success ? PaymentStatus.PAID : PaymentStatus.FAILED;

    return this.updateStatus(orderId, { status: newStatus }, userId);
  }
}
