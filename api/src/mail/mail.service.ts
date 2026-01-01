import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    private resend: Resend;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('RESEND_API_KEY');
        this.resend = new Resend(apiKey);
    }

    async sendHireMeNotification(to: string, fromUser: { name: string; email: string; message: string }) {
        if (!to) {
            console.error('No recipient email configured for Hire Me notifications.');
            return;
        }

        try {
            const { data, error } = await this.resend.emails.send({
                from: 'Hire Me <no-reply@duongle.site>',
                to: to,
                replyTo: fromUser.email,
                subject: `Message from ${fromUser.name}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">New Message</h2>
                        <p><strong>From:</strong> ${fromUser.name} (${fromUser.email})</p>
                        <p><strong>Message:</strong></p>
                        <blockquote style="background: #f9f9f9; border-left: 5px solid #ccc; margin: 1.5em 10px; padding: 0.5em 10px;">
                            ${fromUser.message.replace(/\n/g, '<br>')}
                        </blockquote>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 0.8em; color: #888;">This message was sent from your portfolio website.</p>
                    </div>
                `,
            });

            if (error) {
                console.error('Error sending email:', error);
                return;
            }

            console.log('Message sent:', data?.id);
            return data;
        } catch (error) {
            console.error('Error sending email:', error);
            // Don't throw error to prevent blocking the HTTP response, just log it
        }
    }
}
