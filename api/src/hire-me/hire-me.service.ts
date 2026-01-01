import { Injectable } from '@nestjs/common';
import { CreateHireMeDto } from './dto/create-hire-me.dto';
import { UpdateHireMeDto } from './dto/update-hire-me.dto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class HireMeService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) { }

  async create(data: CreateHireMeDto) {
    const message = await this.prisma.hireMeMessage.create({
      data,
    });

    // Fetch profile to get hireMeEmail
    const profile = await this.prisma.profile.findFirst();
    if (profile?.hireMeEmail) {
      // Send notification email (non-blocking)
      this.mailService.sendHireMeNotification(profile.hireMeEmail, {
        name: data.name,
        email: data.email,
        message: data.message,
      }).catch(err => console.error('Failed to send hire me notification:', err));
    }

    return message;
  }

  async findAll(params: { skip?: number; take?: number; search?: string } = {}) {
    const { skip, take, search } = params;
    const whereSearch = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ]
    } : {};

    return this.prisma.hireMeMessage.findMany({
      where: whereSearch as any,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.hireMeMessage.findUnique({
      where: { id },
    });
  }

  update(id: number, updateHireMeDto: UpdateHireMeDto) {
    // Mostly for marking as read
    return this.prisma.hireMeMessage.update({
      where: { id },
      data: updateHireMeDto,
    });
  }

  remove(id: number) {
    return this.prisma.hireMeMessage.delete({
      where: { id },
    });
  }
}
