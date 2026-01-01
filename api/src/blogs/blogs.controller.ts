import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { Throttle, ThrottlerGuard, SkipThrottle } from '@nestjs/throttler';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) { }


  @SkipThrottle()
  @Public()
  @Get()
  findAllPublic(@Query('skip') skip?: string, @Query('take') take?: string, @Query('search') search?: string) {
    return this.blogsService.findAll(true, {
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      search,
    });
  }

  @SkipThrottle()
  @Get('admin/all')
  findAllAdmin(@Query('skip') skip?: string, @Query('take') take?: string, @Query('search') search?: string) {
    return this.blogsService.findAll(false, {
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      search,
    });
  }

  @SkipThrottle()
  @Get('id/:id')
  findOneById(@Param('id') id: string) {
    return this.blogsService.findOne(+id);
  }

  @Roles('ADMIN')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Roles('ADMIN')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(+id, updateBlogDto);
  }

  @Roles('ADMIN')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(+id);
  }

  @Public()
  @SkipThrottle()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.blogsService.findBySlug(slug);
  }
}
