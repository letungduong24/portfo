import { IsOptional, IsString } from 'class-validator';

export class UpdateEducationDto {
    @IsOptional()
    @IsString()
    fullNameVi?: string;

    @IsOptional()
    @IsString()
    fullNameEn?: string;

    @IsOptional()
    @IsString()
    educationVi?: string;

    @IsOptional()
    @IsString()
    educationEn?: string;
}
