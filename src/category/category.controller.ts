import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Roles } from 'auth/decorators/roles.decorator';
import { Public } from 'auth/decorators/public.decorator';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/request/create-category.dto';
import { UpdateCategoryDto } from './dtos/request/update-category.dto';
import { CategoryDto } from './dtos/response/category.dto';
import { Role } from 'database/generated/prisma/enums';

@Controller('categories')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDto> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @Public()
  async findAll(): Promise<CategoryDto[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @Public()
  async findById(@Param('id', ParseIntPipe) id: number): Promise<CategoryDto> {
    return this.categoryService.findById(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoryService.delete(id);
  }
}
