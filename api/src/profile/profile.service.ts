import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { UpdateSocialLinksDto } from './dto/update-social-links.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) { }

  async create(createProfileDto: CreateProfileDto) {
    const { birthDate, ...rest } = createProfileDto;
    return this.prisma.profile.create({
      data: {
        ...rest,
        birthDate: birthDate ? new Date(birthDate) : undefined,
      },
    });
  }

  findAll() {
    return this.prisma.profile.findMany();
  }

  async findFirst() {
    const profile = await this.prisma.profile.findFirst({
      include: {
        skillGroups: {
          include: {
            skills: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
    });
    if (!profile) {
      // Create default if not exists
      return this.prisma.profile.create({
        data: {
          headlineVi: "Chào, tôi là Dương",
          headlineEn: "Hey, I'm Duong",
          subheadlineVi: "Lập trình viên Web",
          subheadlineEn: "A Web Developer",
          desc1Vi: "Lập trình viên Web với nền tảng thiết kế vững chắc.",
          desc1En: "A Web developer with solid foundations in design.",
          desc2Vi: "Đam mê tạo ra trải nghiệm người dùng liền mạch với sự kết hợp giữa sáng tạo và chức năng.",
          desc2En: "Passionate about crafting seamless user experiences with the intersection of creativity and functionality.",
          fullNameEn: "Le Tung Duong",
          footerTitleVi: "Portfolio Dương",
          footerTitleEn: "Duong Portfolio",
          copyrightNameVi: "Le Tung Duong",
          copyrightNameEn: "Le Tung Duong",
          footerUseProfileContact: true,
          footerEmail: "contact@example.com",
          footerGithub: "https://github.com",
          footerFacebook: "https://facebook.com",
          footerLinkedin: "https://linkedin.com",
          navbarNameVi: "Dương",
          navbarNameEn: "Duong",
          navHireMeVi: "Thuê tôi",
          navHireMeEn: "Hire Me",
          showHireMe: true,

          pageTitle: "Portfolio",
          pageDescription: "My Portfolio",
        },
        include: {
          skillGroups: {
            include: {
              skills: {
                orderBy: { order: 'asc' }
              }
            },
            orderBy: { order: 'asc' }
          }
        },
      });
    }

    // Backfill footer data if missing (for existing profiles)
    if (profile.footerTitleVi === null) {
      return this.prisma.profile.update({
        where: { id: profile.id },
        data: {
          footerTitleVi: "Portfolio Dương",
          footerTitleEn: "Duong Portfolio",
          copyrightNameVi: "Le Tung Duong",
          copyrightNameEn: "Le Tung Duong",
          footerUseProfileContact: true,
          footerEmail: "contact@example.com",
          footerGithub: "https://github.com",
          footerFacebook: "https://facebook.com",
          footerLinkedin: "https://linkedin.com",
          navbarNameVi: "Dương",
          navbarNameEn: "Duong",
          navHireMeVi: "Thuê tôi",
          navHireMeEn: "Hire Me",
          showHireMe: true,

          pageTitle: "Portfolio",
          pageDescription: "My Portfolio",
        },
        include: {
          skillGroups: {
            include: {
              skills: {
                orderBy: { order: 'asc' }
              }
            },
            orderBy: { order: 'asc' }
          }
        },
      });
    }

    // Backfill Navbar data if missing (separate check if footer data exists but navbar doesn't)
    // Checking navbarNameVi instead of navHomeVi which is deleted
    if (profile.navbarNameVi === null) {
      return this.prisma.profile.update({
        where: { id: profile.id },
        data: {
          navbarNameVi: "Dương",
          navbarNameEn: "Duong",
          navHireMeVi: "Thuê tôi",
          navHireMeEn: "Hire Me",
          showHireMe: true,

          pageTitle: "Portfolio",
          pageDescription: "My Portfolio",
        },
        include: {
          skillGroups: {
            include: {
              skills: {
                orderBy: { order: 'asc' }
              }
            },
            orderBy: { order: 'asc' }
          }
        },
      });
    }

    // Backfill Page Settings if missing
    if (profile.pageTitle === null) {
      return this.prisma.profile.update({
        where: { id: profile.id },
        data: {
          pageTitle: "Portfolio",
          pageDescription: "My Portfolio",
        },
        include: {
          skillGroups: {
            include: {
              skills: {
                orderBy: { order: 'asc' }
              }
            },
            orderBy: { order: 'asc' }
          }
        },
      });
    }

    // Backfill Copyright if missing
    if (profile.copyrightNameVi === null) {
      return this.prisma.profile.update({
        where: { id: profile.id },
        data: {
          copyrightNameVi: "Le Tung Duong",
          copyrightNameEn: "Le Tung Duong",
        },
        include: {
          skillGroups: {
            include: {
              skills: {
                orderBy: { order: 'asc' }
              }
            },
            orderBy: { order: 'asc' }
          }
        },
      });
    }

    return profile;
  }

  findOne(id: number) {
    return this.prisma.profile.findUnique({ where: { id } });
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const { birthDate, skillGroups, ...rest } = updateProfileDto as any;
    return this.prisma.profile.update({
      where: { id },
      data: {
        ...rest,
        birthDate: birthDate ? new Date(birthDate) : undefined,
      },
      include: {
        skillGroups: {
          include: {
            skills: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
    });
  }

  async updatePersonalInfo(id: number, dto: UpdatePersonalInfoDto) {
    const { birthDate, ...rest } = dto;
    return this.prisma.profile.update({
      where: { id },
      data: {
        ...rest,
        birthDate: birthDate ? new Date(birthDate) : undefined,
      },
      include: {
        skillGroups: {
          include: {
            skills: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
    });
  }

  async updateHero(id: number, dto: UpdateHeroDto) {
    return this.prisma.profile.update({
      where: { id },
      data: dto,
      include: {
        skillGroups: {
          include: {
            skills: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
    });
  }

  async updateEducation(id: number, dto: UpdateEducationDto) {
    return this.prisma.profile.update({
      where: { id },
      data: dto,
      include: {
        skillGroups: {
          include: {
            skills: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
    });
  }

  async updateSocialLinks(id: number, dto: UpdateSocialLinksDto) {
    return this.prisma.profile.update({
      where: { id },
      data: dto,
      include: {
        skillGroups: {
          include: {
            skills: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
    });
  }

  remove(id: number) {
    return this.prisma.profile.delete({ where: { id } });
  }
}
