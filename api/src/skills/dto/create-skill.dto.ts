import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateSkillDto {
    @IsString()
    @IsNotEmpty()
    nameVi: string;

    @IsString()
    @IsNotEmpty()
    nameEn: string;

    @IsString()
    @IsOptional()
    descriptionVi?: string;

    @IsString()
    @IsOptional()
    descriptionEn?: string;

    @IsInt()
    @IsOptional()
    order?: number;

    @IsInt()
    @IsNotEmpty()
    skillGroupId: number;
}
