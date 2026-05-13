import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthTokenService } from 'shared/security/services/auth-token.service';
import { BcryptService } from 'shared/security/services/bcrypt.service';
import { CreateUserDto } from '../user/dtos/request/create-user.dto';
import { LoginDto } from './dtos/request/login.dto';
import { AuthDto } from './dtos/response/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authTokenService: AuthTokenService,
    private readonly bcryptService: BcryptService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthDto> {
    const user = await this.userService.create(createUserDto);
    const token = await this.authTokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      access_token: token,
      user,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthDto> {
    const { email, password } = loginDto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const isPasswordValid = await this.bcryptService.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const token = await this.authTokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      access_token: token,
      user,
    };
  }
}
