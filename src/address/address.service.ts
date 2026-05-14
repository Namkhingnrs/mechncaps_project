import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'database/prisma.service';
import {
  CreateAddressDto,
  UpdateAddressDto,
} from './dtos/request/create-address.dto';
import { AddressDto } from './dtos/response/address.dto';

type AddressRecord = {
  id: number;
  userId: number;
  fullAddress: string;
  phone: string;
};

type BatchPayload = {
  count: number;
};

type AddressRepository = {
  create(args: {
    data: CreateAddressDto & { userId: number };
  }): Promise<AddressRecord>;
  findMany(args: {
    where: { userId: number };
    orderBy: { id: 'desc' };
  }): Promise<AddressRecord[]>;
  findFirst(args: {
    where: { id: number; userId: number };
  }): Promise<AddressRecord | null>;
  updateMany(args: {
    where: { id: number; userId: number };
    data: UpdateAddressDto;
  }): Promise<BatchPayload>;
  deleteMany(args: {
    where: { id: number; userId: number };
  }): Promise<BatchPayload>;
};

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  private get addressRepository(): AddressRepository {
    return (this.prisma as unknown as { address: AddressRepository }).address;
  }

  private toDto(address: AddressRecord): AddressDto {
    return {
      id: address.id,
      userId: address.userId,
      fullAddress: address.fullAddress,
      phone: address.phone,
    };
  }

  async create(
    userId: number,
    createAddressDto: CreateAddressDto,
  ): Promise<AddressDto> {
    const address = await this.addressRepository.create({
      data: {
        ...createAddressDto,
        userId,
      },
    });

    return this.toDto(address);
  }

  async findAllByUser(userId: number): Promise<AddressDto[]> {
    const addresses = await this.addressRepository.findMany({
      where: { userId },
      orderBy: { id: 'desc' },
    });

    return addresses.map((address) => this.toDto(address));
  }

  async findById(id: number, userId: number): Promise<AddressDto> {
    const address = await this.addressRepository.findFirst({
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

    return this.toDto(address);
  }

  async update(
    id: number,
    userId: number,
    updateAddressDto: UpdateAddressDto,
  ): Promise<AddressDto> {
    const address = await this.addressRepository.updateMany({
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
    const address = await this.addressRepository.deleteMany({
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
