import { IsOptional, IsString } from 'class-validator';

export class UpdateHeroDto {
    @IsOptional()
    @IsString()
    headlineVi?: string;

    @IsOptional()
    @IsString()
    headlineEn?: string;

    @IsOptional()
    @IsString()
    subheadlineVi?: string;

    @IsOptional()
    @IsString()
    subheadlineEn?: string;

    @IsOptional()
    @IsString()
    desc1Vi?: string;

    @IsOptional()
    @IsString()
    desc1En?: string;

    @IsOptional()
    @IsString()
    desc2Vi?: string;

    @IsOptional()
    @IsString()
    desc2En?: string;
}
