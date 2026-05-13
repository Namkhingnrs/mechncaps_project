import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ResponseMessage } from 'common/decorators/success-response-message.decorator';
import { Roles } from 'auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'auth/guards/auth.guard';
import { RoleGuard } from 'auth/guards/role.guard';
import { Role } from 'database/generated/prisma/enums';
import { PaymentService } from './payment.service';
import {
  CreatePaymentDto,
  UpdatePaymentStatusDto,
} from './dtos/request/create-payment.dto';
import { PaymentResponseDto } from './dtos/response/payment-response.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard, RoleGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':orderId')
  @Roles(Role.CUSTOMER)
  @ResponseMessage('Payment created successfully')
  create(
    @Param('orderId') orderId: string,
    @Body() createPaymentDto: CreatePaymentDto,
    @Request() req: any,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.create(+orderId, createPaymentDto, req.user.id);
  }

  @Get(':orderId')
  @Roles(Role.CUSTOMER)
  @ResponseMessage('Payment retrieved successfully')
  findOne(
    @Param('orderId') orderId: string,
    @Request() req: any,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.findOne(+orderId, req.user.id);
  }

  @Patch(':orderId/status')
  @Roles(Role.CUSTOMER)
  @ResponseMessage('Payment status updated successfully')
  updateStatus(
    @Param('orderId') orderId: string,
    @Body() updatePaymentStatusDto: UpdatePaymentStatusDto,
    @Request() req: any,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.updateStatus(
      +orderId,
      updatePaymentStatusDto,
      req.user.id,
    );
  }

  @Post(':orderId/process')
  @Roles(Role.CUSTOMER)
  @ResponseMessage('Payment processing started')
  process(
    @Param('orderId') orderId: string,
    @Request() req: any,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.processPayment(+orderId, req.user.id);
  }
}
