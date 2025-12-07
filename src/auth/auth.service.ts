import {ConflictException, Injectable, NotFoundException, OnModuleInit, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";

@Injectable()
export class AuthService implements OnModuleInit {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {
    }

    // Create first admin on startup
    async onModuleInit() {
        await this.createFirstAdmin();
    }

    async register(registerDto: RegisterDto) {
        const existing = await this.prisma.user.findUnique({where: {email: registerDto.email}});

        if (existing) throw new ConflictException('Email already registered');

        const hashed = await bcrypt.hash(registerDto.password, 10);

        return await this.prisma.user.create({
            data: {
                email: registerDto.email,
                password: hashed,
                name: registerDto.name || null,
                role: 'USER',
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                created_at: true,
            },
        });
    }

    async login(loginDto: LoginDto) {
        const user = await this.prisma.user.findUnique({where: {email: loginDto.email}});
        if (!user || !(await bcrypt.compare(loginDto.password, user.password))) throw new NotFoundException('Invalid credentials');

        if (user.is_deleted || !user.is_active) {
            throw new UnauthorizedException('Account is disabled');
        }

        const payload = {sub: user.id, email: user.email, role: user.role};

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }


    private async createFirstAdmin() {
        const adminExists = await this.prisma.user.findFirst({
            where: {role: 'ADMIN'},
        });

        if (!adminExists) {
            const hashed = bcrypt.hashSync('admin123', 10);
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
