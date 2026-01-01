import { Module } from '@nestjs/common';
import { HireMeService } from './hire-me.service';
import { HireMeController } from './hire-me.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [HireMeController],
  providers: [HireMeService],
})
export class HireMeModule { }
