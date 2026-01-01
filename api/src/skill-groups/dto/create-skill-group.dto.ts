import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateSkillGroupDto {
    @IsString()
    @IsNotEmpty()
    nameVi: string;

    @IsString()
    @IsNotEmpty()
    nameEn: string;

    @IsString()
    @IsNotEmpty()
    icon: string;

    @IsInt()
    @IsOptional()
    order?: number;

    @IsInt()
    @IsOptional()
    profileId?: number;
}
