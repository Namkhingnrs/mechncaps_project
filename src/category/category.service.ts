import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'database/prisma.service';
import { CreateCategoryDto } from './dtos/request/create-category.dto';
import { UpdateCategoryDto } from './dtos/request/update-category.dto';
import { CategoryDto } from './dtos/response/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    const { name } = createCategoryDto;

    // Check if category exists
    const existingCategory = await this.prisma.category.findFirst({
      where: { name },
    });

    if (existingCategory) {
      throw new ConflictException({
        message: 'Category already exists',
        code: 'CATEGORY_EXISTS',
      });
    }

    const category = await this.prisma.category.create({
      data: { name },
    });

    return {
      id: category.id,
      name: category.name,
    };
  }

  async findAll(): Promise<CategoryDto[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    return categories.map((category: { id: number; name: string }) => ({
      id: category.id,
      name: category.name,
    }));
  }

  async findById(id: number): Promise<CategoryDto> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException({
        message: 'Category not found',
        code: 'CATEGORY_NOT_FOUND',
      });
    }

    return {
      id: category.id,
      name: category.name,
    };
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    const category = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });

    return {
      id: category.id,
      name: category.name,
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }
}
