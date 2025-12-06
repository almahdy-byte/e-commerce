import {  IsNotEmpty, IsString } from "class-validator";

export interface ImageType {
    public_id: string,
    secure_url: string
}  
export class ProductImage {
  @IsString()
  @IsNotEmpty()
  public_id: string;

  @IsString()
  @IsNotEmpty()
  secure_url: string;
}