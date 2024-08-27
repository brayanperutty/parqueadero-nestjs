import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    username: string

    @IsString()
    @IsNotEmpty()
    pass: string
}