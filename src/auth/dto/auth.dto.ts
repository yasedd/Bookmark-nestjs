import { IsEmail, IsNotEmpty, IsString, isNotEmpty, isString } from "class-validator";

export class regDto {
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    password:string;

    @IsString()
    fullName:string;
    // firstName:string;

    // @IsString()
    // lastName:string;
}

export class logDto{
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    password:string;
}