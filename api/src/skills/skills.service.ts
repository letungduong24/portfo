import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
    constructor(private prisma: PrismaService) { }

    create(createSkillDto: CreateSkillDto) {
        return this.prisma.skill.create({
            data: createSkillDto,
        });
    }

    findAll() {
        return this.prisma.skill.findMany({
            orderBy: [
                { skillGroupId: 'asc' },
                { order: 'asc' }
            ],
            include: {
                skillGroup: true
            }
        });
    }

    findOne(id: number) {
        return this.prisma.skill.findUnique({
            where: { id },
            include: {
                skillGroup: true
            }
        });
    }

    update(id: number, updateSkillDto: UpdateSkillDto) {
        return this.prisma.skill.update({
            where: { id },
            data: updateSkillDto,
        });
    }

    remove(id: number) {
        return this.prisma.skill.delete({
            where: { id },
        });
    }
}
