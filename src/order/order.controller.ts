import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ResponseMessage } from 'common/decorators/success-response-message.decorator';
import { Roles } from 'auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'auth/guards/auth.guard';
import { RoleGuard } from 'auth/guards/role.guard';
import { Role } from 'database/generated/prisma/enums';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
} from './dtos/request/create-order.dto';
import { OrderResponseDto } from './dtos/response/order-response.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard, RoleGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(Role.CUSTOMER)
  @ResponseMessage('Order created successfully')
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: any,
  ): Promise<OrderResponseDto> {
    return this.orderService.create(createOrderDto, req.user.id);
  }

  @Get()
  @Roles(Role.CUSTOMER)
  @ResponseMessage('Orders retrieved successfully')
  findAll(@Request() req: any): Promise<OrderResponseDto[]> {
    return this.orderService.findAll(req.user.id);
  }

  @Get(':id')
  @Roles(Role.CUSTOMER)
  @ResponseMessage('Order retrieved successfully')
  findOne(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<OrderResponseDto> {
    return this.orderService.findOne(+id, req.user.id);
  }

  @Patch(':id/status')
  @Roles(Role.CUSTOMER)
  @ResponseMessage('Order status updated successfully')
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Request() req: any,
  ): Promise<OrderResponseDto> {
    return this.orderService.updateStatus(
      +id,
      updateOrderStatusDto,
      req.user.id,
    );
  }
}
