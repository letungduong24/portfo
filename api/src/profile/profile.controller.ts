import { Controller, Get, Patch, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { UpdateSocialLinksDto } from './dto/update-social-links.dto';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { Throttle, ThrottlerGuard, SkipThrottle } from '@nestjs/throttler';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @SkipThrottle()
  @Get()
  @Public()
  findFirst() {
    // Always return the first/main profile
    return this.profileService.findFirst();
  }

  @Roles('ADMIN')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    console.log('[ProfileController] Update Schema:', updateProfileDto);
    return this.profileService.update(+id, updateProfileDto);
  }

  @Roles('ADMIN')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Patch(':id/personal')
  updatePersonalInfo(@Param('id') id: string, @Body() dto: UpdatePersonalInfoDto) {
    return this.profileService.updatePersonalInfo(+id, dto);
  }

  @Roles('ADMIN')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Patch(':id/hero')
  updateHero(@Param('id') id: string, @Body() dto: UpdateHeroDto) {
    return this.profileService.updateHero(+id, dto);
  }

  @Roles('ADMIN')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Patch(':id/education')
  updateEducation(@Param('id') id: string, @Body() dto: UpdateEducationDto) {
    return this.profileService.updateEducation(+id, dto);
  }

  @Roles('ADMIN')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Patch(':id/social')
  updateSocialLinks(@Param('id') id: string, @Body() dto: UpdateSocialLinksDto) {
    return this.profileService.updateSocialLinks(+id, dto);
  }

  @Roles('ADMIN')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}
