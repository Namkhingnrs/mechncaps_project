import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Roles } from 'auth/decorators/roles.decorator';
import { Public } from 'auth/decorators/public.decorator';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/request/create-product.dto';
import { UpdateProductDto } from './dtos/request/update-product.dto';
import { QueryProductDto } from './dtos/request/create-product.dto';
import { ProductDto } from './dtos/response/product.dto';
import { Role } from 'database/generated/prisma/enums';

@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductDto> {
    return this.productService.create(createProductDto);
  }

  @Get()
  @Public()
  async findAll(@Query() query: QueryProductDto): Promise<{
    products: ProductDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.productService.findAll(query);
  }

  @Get(':id')
  @Public()
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ProductDto> {
    return this.productService.findById(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productService.delete(id);
  }
}
