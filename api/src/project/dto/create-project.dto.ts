import { IsString, IsArray, IsOptional, ValidateNested, IsObject, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

class TechStackDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    reasonVi?: string;

    @IsString()
    @IsOptional()
    reasonEn?: string;
}

class ChallengeDto {
    @IsString()
    problemVi: string;

    @IsString()
    problemEn: string;

    @IsString()
    solutionVi: string;

    @IsString()
    solutionEn: string;

    @IsString()
    reasonVi: string;

    @IsString()
    reasonEn: string;
}

class LinksDto {
    @IsString()
    @IsOptional()
    demo?: string;

    @IsString()
    @IsOptional()
    repo?: string;
}

class DemoCredentialsDto {
    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    noteVi?: string;

    @IsString()
    @IsOptional()
    noteEn?: string;
}

export class CreateProjectDto {
    @IsString()
    slug: string;

    @IsString()
    titleVi: string;

    @IsString()
    titleEn: string;

    @IsString()
    descriptionVi: string;

    @IsString()
    descriptionEn: string;

    @IsString()
    @IsOptional()
    thumbnailUrl?: string;

    @IsArray()
    @IsString({ each: true })
    tags: string[];

    @IsString()
    roleVi: string;

    @IsString()
    roleEn: string;

    @IsOptional()
    startDate?: Date;

    @IsOptional()
    endDate?: Date;

    @IsString()
    overviewVi: string;

    @IsString()
    overviewEn: string;

    @IsArray()
    @IsString({ each: true })
    problemVi: string[];

    @IsArray()
    @IsString({ each: true })
    problemEn: string[];

    @IsArray()
    @IsString({ each: true })
    solutionVi: string[];

    @IsArray()
    @IsString({ each: true })
    solutionEn: string[];

    @IsArray()
    @IsString({ each: true })
    featuresVi: string[];

    @IsArray()
    @IsString({ each: true })
    featuresEn: string[];

    @IsArray()
    @IsString({ each: true })
    learnedVi: string[];

    @IsArray()
    @IsString({ each: true })
    learnedEn: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TechStackDto)
    techStack: TechStackDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChallengeDto)
    challenges: ChallengeDto[];

    @IsObject()
    @ValidateNested()
    @Type(() => LinksDto)
    links: LinksDto;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => DemoCredentialsDto)
    demoCredentials?: DemoCredentialsDto;

    @IsString()
    @IsOptional()
    architectureVi?: string;

    @IsString()
    @IsOptional()
    architectureEn?: string;
}
