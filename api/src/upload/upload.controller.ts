import { Controller, Post, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Roles } from '../auth/roles.decorator';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Roles('ADMIN')
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
            },
        }),
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new Error('No file uploaded');
        }

        const result = await this.uploadService.uploadImage(file);

        return {
            url: result.url,
            publicId: result.publicId,
            originalname: file.originalname,
            size: file.size,
        };
    }
}
