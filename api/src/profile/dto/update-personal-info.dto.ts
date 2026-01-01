import { IsOptional, IsDateString, IsUrl } from 'class-validator';

export class UpdatePersonalInfoDto {
    @IsOptional()
    @IsDateString()
    birthDate?: Date;

    @IsOptional()
    @IsUrl()
    avatarUrl?: string;
}
