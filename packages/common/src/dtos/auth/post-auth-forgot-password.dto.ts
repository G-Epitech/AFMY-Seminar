import { IsEmail, IsNotEmpty } from 'class-validator';

export class InPostAuthForgotPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
