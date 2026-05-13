import { UserDto } from 'user/dtos/response/user.dto';

export class AuthDto {
  access_token!: string;
  user!: UserDto;
}
