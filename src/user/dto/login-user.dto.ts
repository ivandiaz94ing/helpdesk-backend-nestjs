import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(1, { message: 'Password is required' })
    password: string;
}