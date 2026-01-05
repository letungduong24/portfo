import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSkillGroupDto } from './dto/create-skill-group.dto';
import { UpdateSkillGroupDto } from './dto/update-skill-group.dto';

@Injectable()
export class SkillGroupsService {
    constructor(private prisma: PrismaService) { }

    create(createSkillGroupDto: CreateSkillGroupDto) {
        return this.prisma.skillGroup.create({
            data: createSkillGroupDto,
            include: {
                skills: {
                    orderBy: { order: 'asc' }
                }
            }
        });
    }

    findAll() {
        return this.prisma.skillGroup.findMany({
            orderBy: { order: 'asc' },
            include: {
                skills: {
                    orderBy: { order: 'asc' }
                }
            }
        });
    }

    findOne(id: number) {
        return this.prisma.skillGroup.findUnique({
            where: { id },
            include: {
                skills: {
                    orderBy: { order: 'asc' }
                }
            }
        });
    }

    update(id: number, updateSkillGroupDto: UpdateSkillGroupDto) {
        return this.prisma.skillGroup.update({
            where: { id },
            data: updateSkillGroupDto,
            include: {
                skills: {
                    orderBy: { order: 'asc' }
                }
            }
        });
    }

    remove(id: number) {
        return this.prisma.skillGroup.delete({
            where: { id },
        });
    }
}
