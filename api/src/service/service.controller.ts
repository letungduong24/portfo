import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ServiceService } from './service.service';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('services')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) { }

    @SkipThrottle()
    @Get()
    findAll() {
        return this.serviceService.findAll();
    }

    @Post()
    create(@Body() body: any) {
        return this.serviceService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.serviceService.update(+id, body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.serviceService.delete(+id);
    }
}
