import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Roles } from 'auth/decorators/roles.decorator';
import { UserService } from './user.service';
import { UserDto } from './dtos/response/user.dto';
import { Role } from 'database/generated/prisma/enums';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @Roles(Role.ADMIN)
  async findById(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this.userService.findById(id);
  }
}
