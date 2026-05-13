import { Exclude } from 'class-transformer';
import { Role } from 'database/generated/prisma/enums';

export class UserDto {
  id: number;
  username: string;
  email: string;

  @Exclude()
  password: string;

  role: Role;
  createdAt: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
