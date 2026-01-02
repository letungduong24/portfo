import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { SkillsModule } from './skills/skills.module';
import { SkillGroupsModule } from './skill-groups/skill-groups.module';
import { ProjectModule } from './project/project.module';
import { AiModule } from './ai/ai.module';
import { UploadModule } from './upload/upload.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { BlogsModule } from './blogs/blogs.module';
import { HireMeModule } from './hire-me/hire-me.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ServiceModule } from './service/service.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 5,
    }]),
    PrismaModule,
    AuthModule,
    ProfileModule,
    SkillsModule,
    SkillGroupsModule,
    ProjectModule,
    AiModule,
    UploadModule,
    BlogsModule,
    HireMeModule,
    DashboardModule,
    ServiceModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Must run BEFORE RolesGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
