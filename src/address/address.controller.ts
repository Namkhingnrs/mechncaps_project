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
import { AddressService } from './address.service';
import { CreateAddressDto } from './dtos/request/create-address.dto';
import { UpdateAddressDto } from './dtos/request/create-address.dto';
import { AddressDto } from './dtos/response/address.dto';
import type { JwtPayload } from 'auth/types/jwt-payload.type';

@Controller('addresses')
@UseInterceptors(ClassSerializerInterceptor)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<AddressDto> {
    return this.addressService.create(user.sub, createAddressDto);
  }

  @Get()
  async findAll(@CurrentUser() user: JwtPayload): Promise<AddressDto[]> {
    return this.addressService.findAllByUser(user.sub);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ): Promise<AddressDto> {
    return this.addressService.findById(id, user.sub);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<AddressDto> {
    return this.addressService.update(id, user.sub, updateAddressDto);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    return this.addressService.delete(id, user.sub);
  }
}
