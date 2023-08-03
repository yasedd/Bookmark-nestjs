import { IsEmail, IsOptional, IsString } from "class-validator";

export class editUserDto {
    @IsEmail()
    email?:string;

    @IsString()
    @IsOptional()
    fullName?:string;
    
} 