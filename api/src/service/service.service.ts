import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.service.findMany({
            orderBy: { order: 'asc' },
        });
    }

    async create(data: any) {
        // Get max order
        const maxOrderService = await this.prisma.service.findFirst({
            orderBy: { order: 'desc' },
        });
        const order = maxOrderService ? maxOrderService.order + 1 : 1;

        return this.prisma.service.create({
            data: {
                ...data,
                order,
            },
        });
    }

    async update(id: number, data: any) {
        return this.prisma.service.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        return this.prisma.service.delete({
            where: { id },
        });
    }
}
