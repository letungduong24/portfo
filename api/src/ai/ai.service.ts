import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
    private ai: GoogleGenAI;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        this.ai = new GoogleGenAI({ apiKey });
    }

    async writeProject(prompt: string): Promise<string> {
        const systemPrompt = `
        You are a helpful assistant that generates project portfolios in JSON format.
        Based on the user's input, generate a JSON object that matches the following TypeScript interface:

        interface ProjectFormValues {
            slug: string; // kebab-case
            titleVi: string;
            titleEn: string;
            descriptionVi: string;
            descriptionEn: string;
            thumbnailUrl: string; // empty string default
            tags: string[];
            roleVi: string;
            roleEn: string;
            startDate: string; // ISO 8601 date string YYYY-MM-DD
            endDate: string; // ISO 8601 date string YYYY-MM-DD
            overviewVi: string;
            overviewEn: string;
            problemVi: string[];
            problemEn: string[];
            solutionVi: string[];
            solutionEn: string[];
            featuresVi: string[];
            featuresEn: string[];
            learnedVi: string[];
            learnedEn: string[];
            techStack: { name: string; reasonVi: string; reasonEn: string }[];
            challenges: { problemVi: string; problemEn: string; solutionVi: string; solutionEn: string; reasonVi: string; reasonEn: string }[];
            links: { demo: string; repo: string; api: string };
            demoCredentials: { email: string; password: string; noteVi: string; noteEn: string };
            architectureVi: string;
            architectureEn: string;
        }

        Ensure the content is professional and technical.
        Return ONLY the JSON object, valid and parsable. Do not include markdown formatting like \`\`\`json.
        `;

        const response = await this.ai.models.generateContent({
            model: 'gemma-3-27b-it',
            contents: systemPrompt + "\n\nUser Input: " + prompt,
        });

        const text = response.text ?? '';
        // Clean up markdown if present
        return text.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    async writeBlog(prompt: string): Promise<string> {
        const systemPrompt = `
        You are a professional tech blogger.
        Based on the user's input, generate a blog post in JSON format that matches the following TypeScript interface:

        interface BlogPostFormValues {
            slug: string; // kebab-case
            titleVi: string;
            titleEn: string;
            contentVi: string; // HTML format, rich content
            contentEn: string; // HTML format, rich content
            tags: string[];
            thumbnail?: string; // empty string default
            isPublished: boolean; // default true
        }

        Ensure the content is engaging, informative, and formatted with proper HTML tags (h2, h3, p, ul, li, strong, etc.).
        Return ONLY the JSON object, valid and parsable. Do not include markdown formatting like \`\`\`json.
        `;

        const response = await this.ai.models.generateContent({
            model: 'gemma-3-27b-it',
            contents: systemPrompt + "\n\nUser Input: " + prompt,
        });

        const text = response.text ?? '';
        return text.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    async translateCompose(text: string, targetLanguage: string): Promise<string> {
        const prompt = `Translate the following text or JSON object to ${targetLanguage}. 
        If it is a JSON object, translate the values but keep keys unchanged.
        If it is plain text, just translate it.
        Return ONLY the result.
        
        Input:
        ${text}`;

        const response = await this.ai.models.generateContent({
            model: 'gemma-3-27b-it',
            contents: prompt,
        });
        return (response.text ?? '').replace(/```json/g, '').replace(/```/g, '').trim();
    }

    async generateEmailReply(message: string, senderName: string, prompt: string): Promise<{ subject: string; content: string }> {
        const systemPrompt = `
        You are an AI assistant drafting an email reply for a web developer named Duong.
        You are replying to an inquiry from "${senderName}".
        
        Original Message: "${message}"
        
        User's Hint/Goal: "${prompt}"
        
        Generate a professional and polite email reply.
        Return the result as a JSON object with "subject" and "content" fields.
        "content" should be plain text, suitable for an email body.
        Return ONLY the JSON.
        `;

        const response = await this.ai.models.generateContent({
            model: 'gemma-3-27b-it',
            contents: systemPrompt,
        });

        const text = (response.text ?? '').replace(/```json/g, '').replace(/```/g, '').trim();
        try {
            return JSON.parse(text);
        } catch (e) {
            // Fallback if AI doesn't return valid JSON, try to extract reasonable subject/content
            return {
                subject: `Re: Inquiry from ${senderName}`,
                content: text
            };
        }
    }
}
