import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'database/prisma.service';
import { CreateProductDto } from './dtos/request/create-product.dto';
import { UpdateProductDto } from './dtos/request/update-product.dto';
import { QueryProductDto } from './dtos/request/create-product.dto';
import { ProductDto } from './dtos/response/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDto> {
    const { categoryId, ...productData } = createProductDto;

    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException({
        message: 'Category not found',
        code: 'CATEGORY_NOT_FOUND',
      });
    }

    const product = await this.prisma.product.create({
      data: {
        ...productData,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      material: product.material,
      profile: product.profile,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt,
      category: {
        id: product.category.id,
        name: product.category.name,
      },
    };
  }

  async findAll(query: QueryProductDto): Promise<{
    products: ProductDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, categoryId, search } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    const productDtos = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      material: product.material,
      profile: product.profile,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt,
      category: {
        id: product.category.id,
        name: product.category.name,
      },
    }));

    return {
      products: productDtos,
      total,
      page,
      limit,
    };
  }

  async findById(id: number): Promise<ProductDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException({
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      material: product.material,
      profile: product.profile,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt,
      category: {
        id: product.category.id,
        name: product.category.name,
      },
    };
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    const { categoryId, ...updateData } = updateProductDto;

    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException({
          message: 'Category not found',
          code: 'CATEGORY_NOT_FOUND',
        });
      }
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        ...(categoryId && { categoryId }),
      },
      include: {
        category: true,
      },
    });

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      material: product.material,
      profile: product.profile,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt,
      category: {
        id: product.category.id,
        name: product.category.name,
      },
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }
}
