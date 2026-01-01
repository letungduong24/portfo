import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Roles } from '../auth/roles.decorator';
import { Throttle, ThrottlerGuard, SkipThrottle } from '@nestjs/throttler';

@Controller('skills')
export class SkillsController {
    constructor(private readonly skillsService: SkillsService) { }

    @Roles('ADMIN')
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post()
    create(@Body() createSkillDto: CreateSkillDto) {
        return this.skillsService.create(createSkillDto);
    }

    @SkipThrottle()
    @Get()
    findAll() {
        return this.skillsService.findAll();
    }

    @SkipThrottle()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.skillsService.findOne(+id);
    }

    @Roles('ADMIN')
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
        return this.skillsService.update(+id, updateSkillDto);
    }

    @Roles('ADMIN')
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.skillsService.remove(+id);
    }
}
