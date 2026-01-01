import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) { }

  async getStats() {
    const [projectCount, blogCount, messageCount, blogs] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.blog.count(),
      this.prisma.hireMeMessage.count(),
      this.prisma.blog.findMany({ select: { views: true } })
    ]);

    const totalViews = blogs.reduce((sum, blog) => sum + blog.views, 0);

    return {
      projectCount,
      blogCount,
      messageCount,
      totalViews
    };
  }
}
