import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) { }

  async create(createBlogDto: CreateBlogDto) {
    try {
      return await this.prisma.blog.create({
        data: createBlogDto,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Slug already exists');
      }
      throw error;
    }
  }

  async findAll(onlyPublished: boolean = true, params: { skip?: number; take?: number; search?: string } = {}) {
    const { skip, take, search } = params;

    const whereSearch = search ? {
      OR: [
        { titleVi: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
        { contentVi: { contains: search, mode: 'insensitive' } },
        { contentEn: { contains: search, mode: 'insensitive' } },
      ]
    } : {};

    const where = {
      ...(onlyPublished ? { isPublished: true } : {}),
      ...whereSearch
    };

    return this.prisma.blog.findMany({
      where: where as any,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
    });
    if (!blog) throw new NotFoundException(`Blog #${id} not found`);
    return blog;
  }

  async findBySlug(slug: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { slug },
    });
    if (!blog) throw new NotFoundException(`Blog with slug '${slug}' not found`);

    // Increment views asynchronously
    this.prisma.blog.update({
      where: { id: blog.id },
      data: { views: { increment: 1 } },
    }).catch(err => console.error('Error incrementing views', err));

    return blog;
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    // Check existence
    await this.findOne(id);
    try {
      return await this.prisma.blog.update({
        where: { id },
        data: updateBlogDto,
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
    return this.prisma.blog.delete({
      where: { id },
    });
  }
}
