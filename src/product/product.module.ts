import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from 'database/prisma.service';
import { CategoryModule } from 'category/category.module';

@Module({
  imports: [CategoryModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
  exports: [ProductService],
})
export class ProductModule {}
