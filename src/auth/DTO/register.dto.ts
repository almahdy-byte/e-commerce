import {  IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';
import { Gender, UserRole } from '../../common/user.enums';
import { Type } from 'class-transformer';
export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEnum(UserRole)
    @IsOptional()
    role: UserRole

    @IsEnum(Gender)
    @IsOptional()
    gender: Gender;

    @IsString()
    @IsOptional()
    phone: string;
 
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    DOB:Date;
}


