import { IsString, IsOptional, IsBoolean, IsArray, IsNotEmpty } from 'class-validator';

export class CreateBlogDto {
    @IsString()
    @IsNotEmpty()
    titleVi: string;

    @IsString()
    @IsOptional()
    titleEn?: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsNotEmpty()
    contentVi: string;

    @IsString()
    @IsOptional()
    contentEn?: string;

    @IsString()
    @IsOptional()
    thumbnail?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;
}
