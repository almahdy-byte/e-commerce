import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, Min } from "class-validator";


export class AddTOCart{

    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(1 , {message: 'Quantity must be at least 1'})
    quantity:number;
}

