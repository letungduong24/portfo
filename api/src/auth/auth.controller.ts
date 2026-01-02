import { Controller, Post, UseGuards, Request, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';
import { SkipThrottle } from '@nestjs/throttler';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req, @Res({ passthrough: true }) response: Response) {
        const { access_token } = await this.authService.login(req.user);
        response.cookie('Authentication', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600 * 1000, // 1 hour,
        });
        return { message: 'Logged in successfully' };
    }

    @SkipThrottle()
    @UseGuards(JwtAuthGuard)
    @Get('profile') // To verify auth works
    getProfile(@Request() req) {
        return req.user;
    }

    @Public()
    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('Authentication', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        return { message: 'Logged out successfully' };
    }
}
