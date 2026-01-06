import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ServiceService } from './service.service';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Roles } from '../auth/roles.decorator';

@Controller('services')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) { }

    @SkipThrottle()
    @Get()
    findAll() {
        return this.serviceService.findAll();
    }

    @Roles('ADMIN')
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post()
    create(@Body() body: any) {
        return this.serviceService.create(body);
    }

    @Roles('ADMIN')
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.serviceService.update(+id, body);
    }

    @Roles('ADMIN')
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.serviceService.delete(+id);
    }
}
