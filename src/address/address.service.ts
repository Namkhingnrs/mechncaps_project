import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'database/prisma.service';
import { CreateAddressDto } from './dtos/request/create-address.dto';
import { UpdateAddressDto } from './dtos/request/create-address.dto';
import { AddressDto } from './dtos/response/address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    createAddressDto: CreateAddressDto,
  ): Promise<AddressDto> {
    const address = await this.prisma.address.create({
      data: {
        ...createAddressDto,
        userId,
      },
    });

    return {
      id: address.id,
      userId: address.userId,
      fullAddress: address.fullAddress,
      phone: address.phone,
    };
  }

  async findAllByUser(userId: number): Promise<AddressDto[]> {
    const addresses = await this.prisma.address.findMany({
      where: { userId },
      orderBy: { id: 'desc' },
    });

    return addresses.map((address: any) => ({
      id: address.id,
      userId: address.userId,
      fullAddress: address.fullAddress,
      phone: address.phone,
    }));
  }

  async findById(id: number, userId: number): Promise<AddressDto> {
    const address = await this.prisma.address.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!address) {
      throw new NotFoundException({
        message: 'Address not found',
        code: 'ADDRESS_NOT_FOUND',
      });
    }

    return {
      id: address.id,
      userId: address.userId,
      fullAddress: address.fullAddress,
      phone: address.phone,
    };
  }

  async update(
    id: number,
    userId: number,
    updateAddressDto: UpdateAddressDto,
  ): Promise<AddressDto> {
    const address = await this.prisma.address.updateMany({
      where: {
        id,
        userId,
      },
      data: updateAddressDto,
    });

    if (address.count === 0) {
      throw new NotFoundException({
        message: 'Address not found',
        code: 'ADDRESS_NOT_FOUND',
      });
    }

    return this.findById(id, userId);
  }

  async delete(id: number, userId: number): Promise<void> {
    const address = await this.prisma.address.deleteMany({
      where: {
        id,
        userId,
      },
    });

    if (address.count === 0) {
      throw new NotFoundException({
        message: 'Address not found',
        code: 'ADDRESS_NOT_FOUND',
      });
    }
  }
}
