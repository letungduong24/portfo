import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
    @IsString()
    @IsOptional()
    headlineVi?: string;

    @IsString()
    @IsOptional()
    headlineEn?: string;

    @IsString()
    @IsOptional()
    subheadlineVi?: string;

    @IsString()
    @IsOptional()
    subheadlineEn?: string;

    @IsString()
    @IsOptional()
    desc1Vi?: string;

    @IsString()
    @IsOptional()
    desc1En?: string;

    @IsString()
    @IsOptional()
    desc2Vi?: string;

    @IsString()
    @IsOptional()
    desc2En?: string;

    @IsString()
    @IsOptional()
    fullNameVi?: string;

    @IsString()
    @IsOptional()
    fullNameEn?: string;

    @IsDateString()
    @IsOptional()
    birthDate?: string; // Receive as string, convert in service if needed

    @IsString()
    @IsOptional()
    educationVi?: string;

    @IsString()
    @IsOptional()
    educationEn?: string;

    @IsString()
    @IsOptional()
    github?: string;

    @IsString()
    @IsOptional()
    facebook?: string;

    @IsString()
    @IsOptional()
    linkedin?: string;

    @IsString()
    @IsOptional()
    email?: string;

    // Footer Config
    @IsString()
    @IsOptional()
    footerTitleVi?: string;

    @IsString()
    @IsOptional()
    footerTitleEn?: string;

    @IsString()
    @IsOptional()
    copyrightNameVi?: string;

    @IsString()
    @IsOptional()
    copyrightNameEn?: string;

    @IsBoolean()
    @IsOptional()
    footerUseProfileContact?: boolean;

    @IsString()
    @IsOptional()
    footerEmail?: string;

    @IsString()
    @IsOptional()
    footerGithub?: string;

    @IsString()
    @IsOptional()
    footerFacebook?: string;

    @IsString()
    @IsOptional()
    footerLinkedin?: string;

    // Navbar Config
    @IsString()
    @IsOptional()
    navbarNameVi?: string;

    @IsString()
    @IsOptional()
    navbarNameEn?: string;

    @IsString()
    @IsOptional()
    navHireMeVi?: string;

    @IsString()
    @IsOptional()
    navHireMeEn?: string;

    @IsBoolean()
    @IsOptional()
    showHireMe?: boolean;



    // Page Settings
    @IsString()
    @IsOptional()
    pageTitle?: string;

    @IsString()
    @IsOptional()
    pageDescription?: string;

    @IsString()
    @IsOptional()
    pageIcon?: string;

    @IsString()
    @IsOptional()
    avatarUrl?: string;
}
