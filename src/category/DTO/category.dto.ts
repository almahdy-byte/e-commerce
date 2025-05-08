import { IsNotEmpty, IsObject, IsString } from "class-validator";
import { ImageType } from "src/common/types/image.type";

export class CreateCategoryDTO {
    @IsString()
    @IsNotEmpty()
    categoryName: string;

    @IsObject()
    @IsNotEmpty()
    image:ImageType;

    @IsString()
    folder: string;

}