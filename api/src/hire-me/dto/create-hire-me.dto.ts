import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateHireMeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    message: string;
}
