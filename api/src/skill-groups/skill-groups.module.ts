import { Module } from '@nestjs/common';
import { SkillGroupsService } from './skill-groups.service';
import { SkillGroupsController } from './skill-groups.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [SkillGroupsController],
    providers: [SkillGroupsService],
})
export class SkillGroupsModule { }
