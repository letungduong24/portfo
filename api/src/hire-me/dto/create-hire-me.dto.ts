import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateHireMeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    message: string;
}
