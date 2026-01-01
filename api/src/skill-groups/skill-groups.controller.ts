import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SkillGroupsService } from './skill-groups.service';
import { CreateSkillGroupDto } from './dto/create-skill-group.dto';
import { UpdateSkillGroupDto } from './dto/update-skill-group.dto';
import { Roles } from '../auth/roles.decorator';
import { Throttle, ThrottlerGuard, SkipThrottle } from '@nestjs/throttler';

@Controller('skill-groups')
export class SkillGroupsController {
    constructor(private readonly skillGroupsService: SkillGroupsService) { }

    @Roles('ADMIN')
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post()
    create(@Body() createSkillGroupDto: CreateSkillGroupDto) {
        return this.skillGroupsService.create(createSkillGroupDto);
    }

    @SkipThrottle()
    @Get()
    findAll() {
        return this.skillGroupsService.findAll();
    }

    @SkipThrottle()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.skillGroupsService.findOne(+id);
    }

    @Roles('ADMIN')
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSkillGroupDto: UpdateSkillGroupDto) {
        return this.skillGroupsService.update(+id, updateSkillGroupDto);
    }

    @Roles('ADMIN')
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.skillGroupsService.remove(+id);
    }
}
