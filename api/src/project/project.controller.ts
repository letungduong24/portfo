import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { Throttle, ThrottlerGuard, SkipThrottle } from '@nestjs/throttler';

@Controller('projects')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Roles('ADMIN')
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post()
    create(@Body() createProjectDto: CreateProjectDto) {
        return this.projectService.create(createProjectDto);
    }

    @SkipThrottle()
    @Get()
    @Public()
    findAll(@Query('skip') skip?: string, @Query('take') take?: string, @Query('search') search?: string) {
        return this.projectService.findAll({
            skip: skip ? +skip : undefined,
            take: take ? +take : undefined,
            search,
        });
    }

    @SkipThrottle()
    @Get(':id')
    @Public()
    findOne(@Param('id') id: string) {
        // Check if id is numeric or slug
        if (!isNaN(Number(id))) {
            return this.projectService.findOne(+id);
        }
        return this.projectService.findBySlug(id);
    }

    @Roles('ADMIN')
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateProjectDto: UpdateProjectDto) {
        return this.projectService.update(id, updateProjectDto);
    }

    @Roles('ADMIN')
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.projectService.remove(id);
    }
}
