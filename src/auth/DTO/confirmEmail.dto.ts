import { IsEmail, IsNotEmpty } from "class-validator";

import { IsString } from "class-validator";

export class ConfirmEmailDto {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}   
