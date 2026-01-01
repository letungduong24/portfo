import { IsOptional, IsUrl, IsEmail } from 'class-validator';

export class UpdateSocialLinksDto {
    @IsOptional()
    @IsUrl()
    github?: string;

    @IsOptional()
    @IsUrl()
    linkedin?: string;

    @IsOptional()
    @IsUrl()
    facebook?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
}
