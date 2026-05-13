import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dtos/request/create-user.dto';
import { LoginDto } from './dtos/request/login.dto';
import { AuthDto } from './dtos/response/auth.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthDto> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto): Promise<AuthDto> {
    return this.authService.login(loginDto);
  }
}
