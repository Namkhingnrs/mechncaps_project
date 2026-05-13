import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  })
  fullAddress!: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  })
  phone!: string;
}

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  })
  fullAddress?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  })
  phone?: string;
}
