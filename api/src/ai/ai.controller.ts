import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
    @Post('write-project')
    async writeProject(@Body('prompt') prompt: string) {
        const text = await this.aiService.writeProject(prompt);
        return { text };
    }

    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
    @Post('write-blog')
    async writeBlog(@Body('prompt') prompt: string) {
        const text = await this.aiService.writeBlog(prompt);
        return { text };
    }

    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
    @Post('translate-compose')
    async translateCompose(
        @Body('text') text: string,
        @Body('targetLanguage') targetLanguage: string,
    ) {
        const translation = await this.aiService.translateCompose(text, targetLanguage);
        return { translation };
    }

    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
    @Post('generate-email-reply')
    async generateEmailReply(
        @Body('message') message: string,
        @Body('senderName') senderName: string,
        @Body('prompt') prompt: string,
    ) {
        const reply = await this.aiService.generateEmailReply(message, senderName, prompt);
        return reply;
    }
}
