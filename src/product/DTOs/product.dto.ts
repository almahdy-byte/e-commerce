import { IsString, IsNotEmpty, IsArray, IsNumber, ValidateNested } from 'class-validator';
import {ImageType , ProductImage } from 'src/common/types/image.type';
import { Transform, Type } from 'class-transformer';

export class AddProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value)) 
  @IsNumber()
  price: number;

  @IsString()
  @IsNotEmpty()
  folder: string;

  @IsNotEmpty()
  @Transform(({ value }) =>Number(value)) 
  @IsNumber()
  stock: number;


@IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImage  )
  images: ImageType[];
}

