import {Injectable, OnModuleInit} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {
    }

    // Create first admin on startup
    async onModuleInit() {
        await this.createFirstAdmin();
    }

    private async createFirstAdmin() {
        const adminExists = await this.prisma.user.findFirst({
            where: {role: 'ADMIN'},
        });

        if (!adminExists) {
            const hashed = bcrypt.hashSync('admin123', 12);
            await this.prisma.user.create({
                data: {
                    email: 'admin@ticket.com',
                    password: hashed,
                    name: 'System Administrator',
                    role: 'ADMIN',
                },
            });
            console.log('First admin created → admin@ticket.com / admin123');
        }
    }
}
