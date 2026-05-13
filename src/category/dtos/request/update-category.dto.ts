import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  })
  name?: string;
}
