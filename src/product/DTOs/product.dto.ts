import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';
import { ProductImageType } from 'src/common/types/image.type';
import { Transform } from 'class-transformer';

export class AddProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Transform(({ value }) => Number(value)) // 👈 التحويل هنا
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  folder: string;

  @Transform(({ value }) => Number(value)) // 👈 التحويل هنا
  @IsNumber()
  @IsNotEmpty()
  stock: number;


  @IsArray()
  images: ProductImageType[];
}
