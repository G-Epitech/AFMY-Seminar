import { IsNotEmpty, IsString } from 'class-validator';

export class InPostAuthResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    token: string;
}
