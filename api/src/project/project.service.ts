import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
    constructor(private prisma: PrismaService) { }

    async create(createProjectDto: CreateProjectDto) {
        try {
            // Cast complex objects to any to bypass strict typing issues with Prisma Json
            return await this.prisma.project.create({
                data: createProjectDto as any,
            });
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ConflictException('Slug already exists');
            }
            throw error;
        }
    }

    async findAll(params: { skip?: number; take?: number; search?: string } = {}) {
        const { skip, take, search } = params;
        const where = search ? {
            OR: [
                { titleVi: { contains: search, mode: 'insensitive' } },
                { titleEn: { contains: search, mode: 'insensitive' } },
                { descriptionVi: { contains: search, mode: 'insensitive' } },
                { descriptionEn: { contains: search, mode: 'insensitive' } },
                // Searching in tags array is limited in Prisma, skipping for now or using strict match if needed
                // { tags: { has: search } } 
            ]
        } : {};

        return this.prisma.project.findMany({
            where: where as any,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: number) {
        const project = await this.prisma.project.findUnique({
            where: { id },
        });
        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }

    async findBySlug(slug: string) {
        const project = await this.prisma.project.findUnique({
            where: { slug },
        });
        if (!project) {
            // Return null instead of throwing for cleaner handling on frontend if needed,
            // or throw check caller
            throw new NotFoundException(`Project with slug ${slug} not found`);
        }
        return project;
    }

    async update(id: number, updateProjectDto: UpdateProjectDto) {
        // Ensure exists
        await this.findOne(id);

        try {
            return await this.prisma.project.update({
                where: { id },
                data: updateProjectDto as any,
            });
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ConflictException('Slug already exists');
            }
            throw error;
        }
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.prisma.project.delete({
            where: { id },
        });
    }
}
