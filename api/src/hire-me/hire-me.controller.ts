import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { HireMeService } from './hire-me.service';
import { CreateHireMeDto } from './dto/create-hire-me.dto';
import { UpdateHireMeDto } from './dto/update-hire-me.dto';
import { Public } from '../auth/public.decorator';
import { Throttle, ThrottlerGuard, SkipThrottle } from '@nestjs/throttler';
import { Roles } from '../auth/roles.decorator';

@Controller('hire-me')
export class HireMeController {
  constructor(private readonly hireMeService: HireMeService) { }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 60000 } }) // 1 request per minute
  @Post()
  create(@Body() createHireMeDto: CreateHireMeDto) {
    return this.hireMeService.create(createHireMeDto);
  }

  @SkipThrottle()
  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string, @Query('search') search?: string) {
    return this.hireMeService.findAll({
      skip: skip ? +skip : undefined,
      take: take ? +take : undefined,
      search,
    });
  }

  @SkipThrottle()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hireMeService.findOne(+id);
  }

  @Roles('ADMIN')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHireMeDto: UpdateHireMeDto) {
    return this.hireMeService.update(+id, updateHireMeDto);
  }

  @Roles('ADMIN')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hireMeService.remove(+id);
  }
}
