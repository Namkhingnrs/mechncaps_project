import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  })
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  stock!: number;

  @IsNotEmpty()
  @IsString()
  material!: string;

  @IsNotEmpty()
  @IsString()
  profile!: string;

  @IsNotEmpty()
  @IsString()
  imageUrl!: string;

  @IsNotEmpty()
  @IsInt()
  categoryId!: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  })
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsString()
  profile?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  categoryId?: number;
}

export class QueryProductDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return parseInt(value, 10);
    }
    return value;
  })
  limit?: number = 10;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
