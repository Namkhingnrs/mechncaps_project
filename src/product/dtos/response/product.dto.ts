import { CategoryDto } from 'category/dtos/response/category.dto';

export class ProductDto {
  id!: number;
  name!: string;
  description!: string;
  price!: number;
  stock!: number;
  material!: string;
  profile!: string;
  imageUrl!: string;
  createdAt!: Date;
  category!: CategoryDto;
}
