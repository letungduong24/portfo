import 'dotenv/config';
import { PrismaClient } from '../src/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // Admin user from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin';

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const user = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: hashedPassword,
            name: adminName,
            role: 'ADMIN',
        },
    });

    // Create demo user
    const demoEmail = 'demo@duongle.site';
    const demoPassword = await bcrypt.hash('demo123', 10);

    const demoUser = await prisma.user.upsert({
        where: { email: demoEmail },
        update: {},
        create: {
            email: demoEmail,
            password: demoPassword,
            name: 'Demo User',
            role: 'DEMO',
        },
    });

    const profile = await prisma.profile.upsert({
        where: { id: 1 },
        update: {},
        create: {
            headlineVi: "Chào, tôi là Dương",
            headlineEn: "Hey, I'm Duong",
            subheadlineVi: "Lập trình viên Web",
            subheadlineEn: "A Web Developer",
            desc1Vi: "Lập trình viên Web với nền tảng thiết kế vững chắc.",
            desc1En: "A Web developer with solid foundations in design.",
            desc2Vi: "Đam mê tạo ra trải nghiệm người dùng liền mạch với sự kết hợp giữa sáng tạo và chức năng.",
            desc2En: "Passionate about crafting seamless user experiences with the intersection of creativity and functionality.",
            fullNameVi: "Lê Tùng Dương",
            fullNameEn: "Le Tung Duong",
            educationVi: "Trường Đại học Thủy Lợi",
            educationEn: "Thuy Loi University",
            github: "https://github.com/letungduong",
            facebook: "https://facebook.com/letungduong",
            linkedin: "https://linkedin.com/in/letungduong",
            copyrightNameVi: "Le Tung Duong",
            copyrightNameEn: "Le Tung Duong",
            footerUseProfileContact: true,
            birthDate: new Date('2000-01-01'),
        },
    });



    // Seed Skill Groups and Skills
    const skillGroupsData = [
        {
            nameVi: 'Frontend',
            nameEn: 'Frontend',
            icon: '/logo/frontend.svg',
            order: 1,
            skills: [
                { nameVi: 'Next.js 16', nameEn: 'Next.js 16', descriptionVi: 'Framework', descriptionEn: 'Framework', order: 1 },
                { nameVi: 'React 19', nameEn: 'React 19', descriptionVi: 'Thư viện UI', descriptionEn: 'UI Library', order: 2 },
                { nameVi: 'Tailwind CSS', nameEn: 'Tailwind CSS', descriptionVi: 'CSS Framework', descriptionEn: 'CSS Framework', order: 3 },
                { nameVi: 'Shadcn UI', nameEn: 'Shadcn UI', descriptionVi: 'Component Library', descriptionEn: 'Component Library', order: 4 },
                { nameVi: 'TipTap', nameEn: 'TipTap', descriptionVi: 'Rich Text', descriptionEn: 'Rich Text', order: 5 },
                { nameVi: 'Recharts', nameEn: 'Recharts', descriptionVi: 'Biểu đồ', descriptionEn: 'Charts', order: 6 },
            ]
        },
        {
            nameVi: 'Backend',
            nameEn: 'Backend',
            icon: '/logo/backend.svg',
            order: 2,
            skills: [
                { nameVi: 'NestJS 11', nameEn: 'NestJS 11', descriptionVi: 'Framework', descriptionEn: 'Framework', order: 1 },
                { nameVi: 'TypeScript', nameEn: 'TypeScript', descriptionVi: 'Ngôn ngữ', descriptionEn: 'Language', order: 2 },
                { nameVi: 'Prisma ORM', nameEn: 'Prisma ORM', descriptionVi: 'Database ORM', descriptionEn: 'Database ORM', order: 3 },
                { nameVi: 'Socket.io', nameEn: 'Socket.io', descriptionVi: 'Real-time', descriptionEn: 'Real-time', order: 4 },
                { nameVi: 'Firebase Admin', nameEn: 'Firebase Admin', descriptionVi: 'Backend Service', descriptionEn: 'Backend Service', order: 5 },
                { nameVi: 'Swagger', nameEn: 'Swagger', descriptionVi: 'API Docs', descriptionEn: 'API Docs', order: 6 },
            ]
        },
        {
            nameVi: 'Cơ sở dữ liệu & Lưu trữ',
            nameEn: 'Database & Storage',
            icon: '/logo/database.svg',
            order: 3,
            skills: [
                { nameVi: 'SQL Server', nameEn: 'SQL Server', descriptionVi: 'Database', descriptionEn: 'Database', order: 1 },
                { nameVi: 'CloudBinary', nameEn: 'CloudBinary', descriptionVi: 'Media', descriptionEn: 'Media', order: 2 },
                { nameVi: 'Redis', nameEn: 'Redis', descriptionVi: 'Caching', descriptionEn: 'Caching', order: 3 },
            ]
        },
        {
            nameVi: 'Hạ tầng',
            nameEn: 'Infrastructure',
            icon: '/logo/infrastructure.svg',
            order: 4,
            skills: [
                { nameVi: 'Digital Ocean', nameEn: 'Digital Ocean', descriptionVi: 'Droplet', descriptionEn: 'Droplet', order: 1 },
                { nameVi: 'Docker', nameEn: 'Docker', descriptionVi: 'Containerized', descriptionEn: 'Containerized', order: 2 },
                { nameVi: 'GitHub Actions', nameEn: 'GitHub Actions', descriptionVi: 'CI/CD', descriptionEn: 'CI/CD', order: 3 },
                { nameVi: 'Cloudflare', nameEn: 'Cloudflare', descriptionVi: 'DNS/CDN', descriptionEn: 'DNS/CDN', order: 4 },
                { nameVi: 'Resend', nameEn: 'Resend', descriptionVi: 'Email', descriptionEn: 'Email', order: 5 },
            ]
        },
    ];

    for (const groupData of skillGroupsData) {
        const { skills, ...groupInfo } = groupData;

        // Check if group already exists
        const existingGroup = await prisma.skillGroup.findFirst({
            where: {
                profileId: profile.id,
                nameEn: groupInfo.nameEn
            }
        });

        if (!existingGroup) {
            await prisma.skillGroup.create({
                data: {
                    ...groupInfo,
                    profileId: profile.id,
                    skills: {
                        create: skills
                    }
                }
            });
        }
    }

    console.log({ user, profile });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
