import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InPostAuthLogInDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export type OutPostAuthLogInDto = {
    tokens: {
        access: string;
    }
}
