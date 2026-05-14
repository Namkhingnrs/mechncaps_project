import { IsNotEmpty, IsEmail, MinLength, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  username!: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;
}
